import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const mimeType = (file.mimetype || "").toLowerCase();
  const extension = path.extname(file.originalname || "").toLowerCase();

  const isPdf =
    extension === ".pdf" &&
    (mimeType.includes("pdf") ||
      mimeType === "application/octet-stream" ||
      mimeType === "binary/octet-stream" ||
      !mimeType);

  const isDocx =
    (extension === ".docx" || extension === ".doc") &&
    (mimeType.includes("word") ||
      mimeType.includes("officedocument") ||
      mimeType === "application/zip" ||
      mimeType === "application/octet-stream" ||
      !mimeType);

  if (isPdf || isDocx) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file format. Please upload a standard PDF (.pdf) or Word document (.docx)."
      ),
      false
    );
  }
};

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
}).single("resume");
