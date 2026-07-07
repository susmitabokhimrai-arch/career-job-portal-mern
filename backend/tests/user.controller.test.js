import { jest, describe, test, expect } from "@jest/globals";

import {
  login,
  logout,
  register,
  verifyOtp,
} from "../controllers/user.controller.js";

import { User } from "../models/user.model.js";

describe("User Controller", () => {

  // =====================================================
  // Logout Tests
  // =====================================================

  test("should logout successfully", async () => {

    const req = {};

    const res = {
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await logout(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.cookie).toHaveBeenCalledWith(
      "token",
      "",
      { maxAge: 0 }
    );

    expect(res.json).toHaveBeenCalledWith({
      message: "Logged out successfully.",
      success: true,
    });

  });

  // =====================================================
  // Login Tests
  // =====================================================

  test("should return 400 when login fields are missing", async () => {

    const req = {
      body: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "Something is missing",
      success: false,
    });

  });

  test("should return 400 when user does not exist", async () => {

    User.findOne = jest.fn().mockResolvedValue(null);

    const req = {
      body: {
        email: "test@gmail.com",
        password: "123456",
        role: "student",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      email: "test@gmail.com",
    });

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "Incorrect email or password.",
      success: false,
    });

  });

  // =====================================================
  // Register Tests
  // =====================================================

  test("should return 400 when registration fields are missing", async () => {

    const req = {
      body: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "Something is missing",
      success: false,
    });

  });

  test("should block recruiter registration", async () => {

    const req = {
      body: {
        fullname: "John Doe",
        email: "john@gmail.com",
        password: "123456",
        phoneNumber: "9800000000",
        role: "recruiter",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(403);

    expect(res.json).toHaveBeenCalledWith({
      message: "Recruiter accounts can only be created by an admin.",
      success: false,
    });

  });

  // =====================================================
  // Verify OTP Tests
  // =====================================================

  test("should return 404 when user is not found during OTP verification", async () => {

    User.findOne = jest.fn().mockResolvedValue(null);

    const req = {
      body: {
        email: "abc@gmail.com",
        otp: "123456",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await verifyOtp(req, res);

    expect(res.status).toHaveBeenCalledWith(404);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "User not found",
    });

  });

  test("should return 400 when email is already verified", async () => {

    User.findOne = jest.fn().mockResolvedValue({
      isVerified: true,
    });

    const req = {
      body: {
        email: "abc@gmail.com",
        otp: "123456",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await verifyOtp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Email already verified",
    });

  });

  test("should return 400 for invalid OTP", async () => {

    User.findOne = jest.fn().mockResolvedValue({
      isVerified: false,
      otp: "654321",
      otpExpiry: new Date(Date.now() + 60000),
    });

    const req = {
      body: {
        email: "abc@gmail.com",
        otp: "123456",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await verifyOtp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid OTP",
    });

  });

});