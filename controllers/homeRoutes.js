const router = require('express').Router();
const { User, UserAuth} = require('../models');
const { withAuth } = require('../utils/auth');

// render homepage as index
router.get('/', async (req, res) => {
  if (req.session.logged_in) {
    console.log({user_id: req.session.user_id});
    res.locals.sess_user_id = req.session.user_id;

    res.render('home', {

    });
    return;
  }
  res.render('index'); 
});

// render the login page
router.get('/login', (req, res) => {

  res.render('login');
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/userPage", (req, res) => {
  res.render("userPage");
});

router.get("/newPost", (req, res) => {
  res.render("newPost");
});

module.exports = router;