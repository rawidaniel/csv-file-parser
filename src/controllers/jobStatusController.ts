import { Request, Response, NextFunction } from "express";
import { csvQueue } from '../queue/csvQueue';
import AppError from "../utils/appError";

export const getCsvJobStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { jobId } = req.params;
  const job = await csvQueue.getJob(jobId);
  if (!job) {
    return next(new AppError("Job not found", 404));
  }
  const state = await job.getState();
  const result = await job.returnvalue;
  res.json({
    jobId,
    state,
    result,
    failedReason: job.failedReason || undefined,
  });
}; 