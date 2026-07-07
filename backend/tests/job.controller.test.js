import { jest, describe, test, expect } from "@jest/globals";

import {
  postJob,
  getJobById,
  getRecommendedJobs,
} from "../controllers/job.controller.js";

describe("Job Controller", () => {

  // =========================================
  // Post Job Tests
  // =========================================

  test("should block non-recruiter from posting a job", async () => {

    const req = {
      user: { role: "student" },
      id: "123",
      body: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await postJob(req, res);

    expect(res.status).toHaveBeenCalledWith(403);

    expect(res.json).toHaveBeenCalledWith({
      message: "Only recruiters can post jobs",
      success: false,
    });

  });

  test("should return 400 when required fields are missing", async () => {

    const req = {
      user: { role: "recruiter" },
      id: "123",
      body: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await postJob(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "something is missing.",
      success: false,
    });

  });

  // =========================================
  // Get Job By ID Test
  // =========================================

  test("should return 400 for invalid job ID", async () => {

    const req = {
      params: {
        id: "abc",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getJobById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid Internship ID",
      success: false,
    });

  });

  // =========================================
  // Recommended Jobs Test
  // =========================================

  test("should return empty recommendation when user has no skills", async () => {

    const req = {
      user: {
        profile: {
          skills: [],
        },
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getRecommendedJobs(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      jobs: [],
      message: "No skills found. Add skills to get recommendations.",
    });

  });

});