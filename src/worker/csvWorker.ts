import { Worker, Job } from 'bullmq';
import { processAndAggregateCsv } from '../services/csvService';

const worker = new Worker('csv-processing', async (job: Job) => {
  if (job.name === 'process') {
    const { inputBuffer, outputPath } = job.data;
    return await processAndAggregateCsv(Buffer.from(inputBuffer), outputPath);
  } else {
    throw new Error(`No handler for job type: ${job.name}`);
  }
}, {
  connection: {
    host: '127.0.0.1',
    port: 6379,
  },
});

worker.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed!`, result);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

console.log('CSV worker started and listening for jobs (BullMQ)...');
