import { jest, describe, test, expect } from "@jest/globals";

import {
  registerCompany,
  getCompanyById,
  softDeleteCompany,
  restoreCompany,
} from "../controllers/company.controller.js";

import { Company } from "../models/company.model.js";

describe("Company Controller", () => {

  // =========================================
  // Register Company
  // =========================================

  test("should return 400 when company name is missing", async () => {

    const req = {
      body: {},
      id: "123",
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await registerCompany(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "Company name is required.",
      success: false,
    });

  });

  // =========================================
  // Get Company By ID
  // =========================================

  test("should return 400 when company is not found", async () => {

    Company.findOne = jest.fn().mockResolvedValue(null);

    const req = {
      params: {
        id: "company123",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getCompanyById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "Company not found.",
      success: false,
    });

  });

  // =========================================
  // Soft Delete Company
  // =========================================

  test("should return 404 when deleting non-existing company", async () => {

    Company.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    const req = {
      params: {
        id: "company123",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await softDeleteCompany(req, res);

    expect(res.status).toHaveBeenCalledWith(404);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Company not found",
    });

  });

  // =========================================
  // Restore Company
  // =========================================

  test("should return 404 when restoring non-existing company", async () => {

    Company.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    const req = {
      params: {
        id: "company123",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await restoreCompany(req, res);

    expect(res.status).toHaveBeenCalledWith(404);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Company not found",
    });

  });

});