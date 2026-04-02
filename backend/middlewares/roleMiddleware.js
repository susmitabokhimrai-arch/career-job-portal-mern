export const isStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({
      message: "Access denied. Students only.",
      success: false,
    });
  }
  next();
};

export const isRecruiter = (req, res, next) => {
  if (req.user.role !== "recruiter") {
    return res.status(403).json({
      message: "Access denied. Recruiters only.",
      success: false,
    });
  }
  next();
};