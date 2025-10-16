import multer from "multer";

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // Directory to save uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Unique filename
  },
});

export const upload = multer({ storage });
