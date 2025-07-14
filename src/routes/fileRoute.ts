import { Router } from "express";
import { uploadCsvFile, uploadCsvMulter } from "../controllers/fileController";

const router = Router();

// File Routes
router.post("/upload", uploadCsvMulter, uploadCsvFile);

export default router;
