const seedUsers = require("./user-seeds");
const seedUserAuths = require("./user-auth-seeds");
/*
const seedTrips = require("./trip-seeds.js");
const seedBookings = require("./booking-seeds.js");
*/

const sequelize = require("../config/connection");

const seedAll = async () => {
  await sequelize.sync({ force: true });
  console.log("\n----- DATABASE SYNCED -----\n");
  await seedUsers();
  console.log("\n----- USERS SEEDED -----\n");
  await seedUserAuths();
  console.log("\n----- USERS AUTH SEEDED -----\n");


//TODO: Update seed data
  /*
  await seedTrips();
  console.log("\n----- TRIPS SEEDED -----\n");

  await seedBookings();
  console.log("\n----- BOOOKINGS SEEDED -----\n");
*/
  process.exit(0);
};

seedAll();
