const router = require('express').Router();
const { User, UserAuth, Trip, Destination} = require('../../models');
const { userAPIAuth } = require('../../utils/auth');
const sequelize = require('../../config/connection');

router.post('/auth', async (req, res) => {
    try{
        // Find the user who matches the posted e-mail address
        console.log(User);
        const userData = await User.findOne({
            include: [{ 
                model: UserAuth,
                where: {auth_type: 'email'}
            }],
            where: { email: req.body.email } 
        });

        if (!userData || !userData.user_auths || userData.user_auths.length < 1) {
        res
            .status(401)
            .json({ message: 'Incorrect email or password, please try again' });
        return;
        }

        // Verify the posted password with the password store in the database
        const validPassword = await userData.user_auths[0].checkPassword(req.body.password);

        if (!validPassword) {
        res
            .status(401)
            .json({ message: 'Incorrect email or password, please try again' });
        return;
        }
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            
            res.json({ status: 'success', message: 'You are now logged in!' });
          });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post("/signup", async (req, res) => {
  try {
    //validate for the unique e-mail address
    console.log(User);
    const dbUserData = await User.findOne({
      where: { email: req.body.email },
    });

    if (dbUserData) {
      res
        .status(409)
        .json({ message: "Email already exists. Please try again" });
      return;
    }

    const newUser = await User.create({
      first_name: req.body.firstname,
      last_name: req.body.lastname,
      email: req.body.email,
    });

    const newUserAuth = await UserAuth.create({
      password: req.body.password,
      user_id: newUser.id,
      auth_type: "email",
    });
    res.status(200).json({ id: newUser.id });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});  

router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
        res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

// add a user trip
router.post('/:id/trips', userAPIAuth, async (req, res) =>{
  const {name, origin, departure_date, return_date, destinations} = req.body;
  console.log('++++ post trip ++++++', req.body);
  const newTrip = await Trip.create({
    name,
    origin,
    departure_date,
    return_date,
    user_id: req.session.user_id
  });
  if(destinations){
    destinations.forEach( async (destination) => {
      if(destination.id){
        //then it's an update, for a created trip this shouldn't be the case
      } else {
        //create a new destination
        await Destination.create({
          location_name: destination.location_name,
          notes: destination.notes,
          order: destination.order,
          trip_id: newTrip.id,
        });
      }
    });
  }


  res.status(200).json({ id: newTrip.id });
});

router.post('/:id/trips/:trip_id', userAPIAuth, async (req, res) =>{
  const {name, origin, departure_date, return_date, destinations, deleted_destinations} = req.body;
  console.log('++++', req.body);
  const newTrip = await Trip.update({
    name,
    origin,
    departure_date,
    return_date
  },
  {
    where: {
      id: req.params.trip_id,
      deleted_dt: null
    }
  });
  if(destinations){
    destinations.forEach((destination) => {
      if(destination.id){
        //then it's an update, for a created trip this shouldn't be the case
        Destination.update(
          {
            location_name: destination.location_name,
            notes: destination.notes,
            order: destination.order,
            // trip_id: trip_id,
          },
          {
            where: {
              id: destination.id,
              trip_id: req.params.trip_id,
            }
          }
        );
      } else {
        //create a new destination
        Destination.create({
          location_name: destination.location_name,
          notes: destination.notes,
          order: destination.order,
          trip_id: req.params.trip_id,
        });
      }
    });

    if(deleted_destinations){
      deleted_destinations.forEach((id) => {
        Destination.destroy({
          where: {
            id: id,
          },
        });
      });
    }
  }


  res.status(200).json({ id: newTrip.id });
});

router.get('/:id/trips/:trip_id', userAPIAuth, async (req, res) =>{
  try{
    // find a single trip by its `id` and user
    // be sure to include its associated Category and Tag data
    const trip_id = req.params.trip_id;
    const user_id = req.params.id;

    const tripData = await Trip.findByPk(trip_id, {
      include: [{ model: Destination}],
      where: {
        user_id: user_id,
        deleted_dt: null,
      },
      order:[['destinations', 'order', 'ASC']],
    });

    if(!tripData){
      res.status(404).json({message: `No Trip found with an id of '${req.params.trip_id}'.`});
    } else {
      res.status(200).json(tripData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/:id/trips/', userAPIAuth, async (req, res) =>{
  try{
    // find a single trip by its `id` and user
    // be sure to include its associated Category and Tag data
    const trip_id = req.params.trip_id;
    const user_id = req.params.id;
    const filter = req.query.filter ? req.query.filter : {};

    const tripData = await Trip.findAll(trip_id, {
      include: [{ model: Destination}],
      where: {
        ...filter,
        user_id: user_id,
        deleted_dt: null
        ,
      },
    });

    if(!tripData){
      res.status(404).json({message: `No Trip found for user '${req.params.id}'.`});
    } else {
      res.status(200).json(tripData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id/trips/:trip_id', userAPIAuth, (req, res) => {
  // delete one Trip by its `id` value
  Trip.update(
    {
      deleted_dt: sequelize.fn('NOW'),
      // trip_id: trip_id,
    },
    {
      where: {
        id: req.params.trip_id,
        user_id: req.params.id
      }
    }
  )
    .then((updatedTrip) => {
      res.json(updatedTrip);
    })
    .catch((err) => res.json(err));
});

router.post('/:id/trips/:trip_id/curate', userAPIAuth, async (req, res) =>{
  const {departure_date, return_date, groupsize, origin, notes} = req.body;
  Trip.update(
    {
      status: 'awaiting_curation',
      departure_date,
      return_date,
      groupsize,
      origin,
      notes
    },
    {
      where: {
        id: req.params.trip_id,
        user_id: req.params.id
      }
    }
  )
    .then((updatedTrip) => {
      res.json(updatedTrip);
    })
    .catch((err) => res.json(err));
});



module.exports = router;
