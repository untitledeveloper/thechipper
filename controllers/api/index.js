const router = require('express').Router();

const dbRoutes = require('./dbRoutes');
const userRoutes = require('./userRoutes');

router.use('/db', dbRoutes);
router.use('/users', userRoutes);

module.exports = router;
