import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const mimeType = file.mimetype;
  const extension = path.extname(file.originalname).toLowerCase();

  const isPdf = mimeType === "application/pdf" && extension === ".pdf";
  const isDocx =
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
    extension === ".docx";

  if (isPdf || isDocx) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only PDF (.pdf) and DOCX (.docx) files are allowed, and file extension must match its type."
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
