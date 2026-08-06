import express from "express";
import { verifyAccessToken } from "../middleware/auth.js";
import { resumeLimiter } from "../middleware/featureLimiters.js";
import { uploadResume } from "../middleware/upload.js";
import { matchResume, getResumeHistory } from "../controllers/resumeController.js";

const router = express.Router();

// Wrap multer so filter/size errors become clean 400s instead of 500s
const handleUpload = (req, res, next) => {
  uploadResume(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || "Invalid file upload" });
    }
    next();
  });
};

// All routes protected by verifyAccessToken and resumeLimiter
router.use(verifyAccessToken, resumeLimiter);

router.post("/match", handleUpload, matchResume);
router.get("/history", getResumeHistory);

export default router;
