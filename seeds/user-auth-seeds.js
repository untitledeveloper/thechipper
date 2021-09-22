const { UserAuth } = require("../models");

const userAuthData = [
  {
    password: 'test1',
    auth_type: 'email',
    user_id: 1,
  },
  {
    password: 'test2',
    auth_type: 'email',
    user_id: 2,
  },
];

const seedUserAuth = () => UserAuth.bulkCreate(userAuthData,{individualHooks: true});

module.exports = seedUserAuth;
