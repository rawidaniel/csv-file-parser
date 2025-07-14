import { Router } from "express";
import { uploadCsvFile, uploadCsvMulter } from "../controllers/fileController";
import { protect } from "../controllers/authController";

const router = Router();

// File Routes
router.post("/upload", protect, uploadCsvMulter, uploadCsvFile);

export default router;
