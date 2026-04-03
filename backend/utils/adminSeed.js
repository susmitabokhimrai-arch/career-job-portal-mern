/**
 * adminSeed.js — Run ONCE to create the admin account.
 * 
 * Usage:
 *   node utils/adminSeed.js
 * 
 * Add to your .env:
 *   ADMIN_EMAIL=admin@careeryatra.com
 *   ADMIN_PASSWORD=your_secure_password
 *   ADMIN_PHONE=9800000000
 *   ADMIN_NAME=CareerYatra Admin
 */

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("⚠️  Admin already exists:", existingAdmin.email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@1234", 10);

    await User.create({
      fullname: process.env.ADMIN_NAME || "CareerYatra Admin",
      email: process.env.ADMIN_EMAIL || "admin@careeryatra.com",
      phoneNumber: process.env.ADMIN_PHONE || 9800000000,
      password: hashedPassword,
      role: "admin",
      profile: { profilePhoto: "" },
    });

    console.log("✅ Admin account created successfully!");
    console.log("   Email:", process.env.ADMIN_EMAIL || "admin@careeryatra.com");
    console.log("   Password:", process.env.ADMIN_PASSWORD || "Admin@1234");
    console.log("\n🔒 Keep these credentials safe and change the password after first login.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();