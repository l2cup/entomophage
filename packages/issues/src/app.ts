import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { mq } from '@entomophage/common';
import listenForMessages from './queue';
import router from './routes';

dotenv.config();

const { DB_URI, PORT, MQ_URI } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('common'));
app.use(cors());

app.set('port', PORT || 5060);

app.use(router);

mq.connectToQueues(MQ_URI as string).then(async () => {
  await listenForMessages();
}).catch(() => {
  console.error('Error connecting to queues.');
  process.exit(1);
});

if (DB_URI !== undefined) {
  mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('MONGOOSE | Connected to database.');
  }).catch((err) => {
    console.error('Cannot connect to the database.');
    console.error(`Error : ${err}`);
    process.exit(1);
  });
} else {
  console.error('Database connection URI undefined. Exiting...');
  process.exit(1);
}

export default app;
