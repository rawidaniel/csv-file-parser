import Queue from 'bull';
import { v4 as uuidv4 } from 'uuid';

// Create a Bull queue for CSV processing
const csvQueue = new Queue('csv-processing', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});

export default csvQueue; 