import { jest, describe, test, expect } from "@jest/globals";

import {
  applyJob,
  getAppliedJobs,
  getApplicants,
  updateStatus,
} from "../controllers/application.controller.js";

import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

describe("Application Controller", () => {

  // ==========================================
  // Apply Job
  // ==========================================

  test("should return 400 when internship id is missing", async () => {

    const req = {
      id: "user123",
      params: {}
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await applyJob(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "Internship id is required.",
      success: false
    });

  });

  // ==========================================
  // Get Applied Jobs
  // ==========================================

  test("should return empty application list", async () => {

    Application.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue([])
      })
    });

    const req = {
      id: "user123"
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getAppliedJobs(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      application: [],
      success: true,
      message: "No applications found"
    });

  });

  // ==========================================
  // Get Applicants
  // ==========================================

  test("should return 404 when internship is not found", async () => {

    Job.findById = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue(null)
    });

    const req = {
      params: {
        id: "job123"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getApplicants(req, res);

    expect(res.status).toHaveBeenCalledWith(404);

    expect(res.json).toHaveBeenCalledWith({
      message: "Internship not found.",
      success: false
    });

  });

  // ==========================================
  // Update Status
  // ==========================================

  test("should return 400 for invalid status", async () => {

    const req = {
      body: {
        status: "invalidstatus"
      },
      params: {
        id: "application123"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await updateStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid status value.",
      success: false
    });

  });

});