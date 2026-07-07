import { jest, describe, test, expect, beforeEach } from "@jest/globals";

import { getStats } from "../controllers/adminController.js";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

describe("Admin Controller", () => {

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("should return dashboard statistics", async () => {

    // Mock countDocuments
    User.countDocuments = jest.fn().mockResolvedValue(10);
    Job.countDocuments = jest.fn().mockResolvedValue(5);
    Application.countDocuments = jest.fn().mockResolvedValue(20);

    // Mock aggregate (history)
    User.aggregate = jest.fn().mockResolvedValue([{ count: 2 }, { count: 3 }]);
    Job.aggregate = jest.fn().mockResolvedValue([{ count: 1 }, { count: 4 }]);
    Application.aggregate = jest.fn().mockResolvedValue([{ count: 5 }, { count: 6 }]);

    const req = {};

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await getStats(req, res);

    expect(res.json).toHaveBeenCalled();

  });

  test("should return 500 when server error occurs", async () => {

    User.countDocuments = jest.fn().mockRejectedValue(new Error("Database Error"));

    const req = {};

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await getStats(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      message: "Server error",
      error: "Database Error",
    });

  });

});