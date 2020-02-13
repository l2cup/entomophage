import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import router from './routes';

dotenv.config();

const { DB_URI, PORT } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('common'));
app.use(cors());


app.set('port', PORT || 5050);

app.use(router);

if (DB_URI !== undefined) {
  mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('MONGOOSE | Connected to database.');
  });
}

export default app;
