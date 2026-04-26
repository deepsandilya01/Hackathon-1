import { body, validationResult } from "express-validator";

export const validateIncidentReport = [
  body("title")
    .trim()
    .notEmpty().withMessage("Incident title is required")
    .isLength({ min: 5, max: 100 }).withMessage("Title must be between 5 and 100 characters")
    .escape(),
  body("description")
    .trim()
    .notEmpty().withMessage("Incident description is required")
    .isLength({ min: 10, max: 1000 }).withMessage("Description must be between 10 and 1000 characters")
    .escape(),
  body("location")
    .trim()
    .notEmpty().withMessage("Location is required")
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];
