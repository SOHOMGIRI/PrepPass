import express from "express";
import { verifyAccessToken } from "../middleware/auth.js";
import { resumeLimiter } from "../middleware/featureLimiters.js";
import { uploadResume } from "../middleware/upload.js";
import { checkDbConnection } from "../middleware/errorHandler.js";
import { analyzeResume, getAnalysisHistory } from "../controllers/resumeAnalysisController.js";

const router = express.Router();

router.use(checkDbConnection);

// Wrap multer so filter/size errors become clean 400s instead of 500s
const handleUpload = (req, res, next) => {
  uploadResume(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || "Invalid file upload" });
    }
    next();
  });
};

router.use(verifyAccessToken, resumeLimiter);

router.post("/", handleUpload, analyzeResume);
router.get("/history", getAnalysisHistory);

export default router;
