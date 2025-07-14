import csvQueue from "../queue/csvQueue";
import { processAndAggregateCsv } from "../services/csvService";

csvQueue.process(async (job) => {
  const { inputBuffer, outputPath } = job.data;
  // processAndAggregateCsv returns metrics
  return await processAndAggregateCsv(Buffer.from(inputBuffer), outputPath);
});

console.log("CSV worker started and listening for jobs...");
