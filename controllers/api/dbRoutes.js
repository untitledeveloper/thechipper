const sequelize = require('../../config/connection');

const router = require('express').Router();


router.get('/connection_status', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({db_status: "connected"});
      } catch (error) {
        res.status(503).json({db_status: "connection error"});
      }
  });


module.exports = router;