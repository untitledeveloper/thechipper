const { User } = require("../models");

const userData = [
  {
    first_name: "John",
    last_name: "Benjamin",
    address: "20,newst,melbourne,vic,3001",
    email: "johnb@gmail.com",
    role: "USER1",
  },
  {
    first_name: "Shalom",
    last_name: "Benjamin",
    address: "82 goodbook dr,melbourne,vic,3001",
    email: "ShalomB@hotmail.com",
    role: "ADMIN1",
  },
];

const seedUser = () => User.bulkCreate(userData);

module.exports = seedUser;
