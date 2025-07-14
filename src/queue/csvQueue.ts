import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';

// Create a Bull queue for CSV processing
export  const csvQueue = new Queue('csv-processing', {
  connection: {
    host: '127.0.0.1',
    port: 6379,
  },
});     