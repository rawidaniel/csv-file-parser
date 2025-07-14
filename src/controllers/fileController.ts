import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import multer from "multer";
import path from "path";
import { processAndAggregateCsv } from "../services/csvService";
import { v4 as uuidv4 } from "uuid";
import AppError from "../utils/appError";

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

    // Process and aggregate the CSV file, get metrics
    const { processingTimeMs, departmentCount } = await processAndAggregateCsv(req.file.buffer, outputPath);

    // Construct download link (assuming static serving from /output)
    const downloadLink = `/output/${outputFileName}`;
    res.status(200).json({
      message: "CSV file processed successfully",
      downloadLink,
      processingTimeMs,
      departmentCount,
    });
  }
);
