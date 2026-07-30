// Run with: npm run seed
// Creates a demo admin account, plus a sample verified donor, receiver, and food listing.
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const Ngo = require("../models/Ngo");
const Food = require("../models/Food");

const run = async () => {
  await connectDB();

  console.log("Clearing existing demo data...");
  await Promise.all([
    User.deleteMany({ email: { $in: ["admin@foodbridge.ai", "donor@demo.com", "ngo@demo.com"] } }),
  ]);

  console.log("Creating admin...");
  const admin = await User.create({
    name: "Platform Admin",
    email: "admin@foodbridge.ai",
    phone: "9999999999",
    password: "admin123",
    role: "admin",
    verified: true,
  });

  console.log("Creating demo donor (verified)...");
  const donorUser = await User.create({
    name: "Ravi Sharma",
    email: "donor@demo.com",
    phone: "9876543210",
    password: "demo1234",
    role: "donor",
    verified: true,
    address: "MG Road, Ahmedabad",
    location: { type: "Point", coordinates: [72.5714, 23.0225] },
  });
  const restaurant = await Restaurant.create({
    user: donorUser._id,
    restaurantName: "Sharma's Kitchen",
    licenseNumber: "LIC12345",
    verified: true,
  });

  console.log("Creating demo receiver / NGO (verified)...");
  const ngoUser = await User.create({
    name: "Meera Patel",
    email: "ngo@demo.com",
    phone: "9123456780",
    password: "demo1234",
    role: "receiver",
    verified: true,
    address: "Navrangpura, Ahmedabad",
    location: { type: "Point", coordinates: [72.5605, 23.0333] },
  });
  const ngo = await Ngo.create({
    user: ngoUser._id,
    organizationName: "Ahmedabad Food Bank",
    registrationNumber: "NGO98765",
    verified: true,
    capacity: 100,
  });

  console.log("Creating a sample food listing...");
  const now = new Date();
  await Food.create({
    restaurant: restaurant._id,
    donor: donorUser._id,
    title: "Vegetable Biryani",
    category: "Rice",
    description: "Freshly prepared, surplus from a catering event.",
    quantity: 25,
    unit: "plates",
    foodType: "veg",
    preparedTime: now,
    expiryTime: new Date(now.getTime() + 4 * 60 * 60 * 1000),
    pickupStart: new Date(now.getTime() + 30 * 60 * 1000),
    pickupEnd: new Date(now.getTime() + 3 * 60 * 60 * 1000),
    address: "MG Road, Ahmedabad",
    location: { type: "Point", coordinates: [72.5714, 23.0225] },
  });

  console.log("\nSeed complete. Demo accounts:");
  console.log("  Admin    -> admin@foodbridge.ai / admin123");
  console.log("  Donor    -> donor@demo.com / demo1234");
  console.log("  Receiver -> ngo@demo.com / demo1234");

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
