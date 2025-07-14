import { Router } from "express";
import { uploadCsvFile, uploadCsvMulter } from "../controllers/fileController";
import { protect } from "../controllers/authController";
import { getCsvJobStatus } from "../controllers/jobStatusController";

const router = Router();

// File Routes
router.post("/upload", protect, uploadCsvMulter, uploadCsvFile);
router.get("/status/:jobId", getCsvJobStatus);

export default router;
