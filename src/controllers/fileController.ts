import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import multer from "multer";
import path from "path";
import { processAndAggregateCsv } from "../services/csvService";
import { v4 as uuidv4 } from "uuid";
import AppError from "../utils/appError";
import csvQueue from "../queue/csvQueue";

// Set up multer storage (in-memory for streaming) and filter for CSV files only
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Accept only files with mimetype 'text/csv' or .csv extension
    if (
      file.mimetype === "text/csv" ||
      (file.originalname && file.originalname.toLowerCase().endsWith(".csv"))
    ) {
      cb(null, true);
    } else {
      cb(new AppError("Only CSV files are allowed", 400));
    }
  },
});

export const uploadCsvMulter = upload.single("file");

export const uploadCsvFile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next(new AppError("No file uploaded", 400));
    }
    // Generate a unique filename for the output
    const outputFileName = `${uuidv4()}.csv`;
    const outputPath = path.join(__dirname, "../../output", outputFileName);

    // Enqueue a job to process the CSV in the background
    const job = await csvQueue.add({
      inputBuffer: req.file.buffer,
      outputPath,
    });

    // Respond with job ID and status endpoint
    res.status(202).json({
      message: "CSV file processing started in background",
      jobId: job.id,
      statusUrl: `/api/file/status/${job.id}`,
      downloadLink: `/output/${outputFileName}`,
    });
  }
);
