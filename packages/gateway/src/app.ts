import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import router from './routes';

dotenv.config();

const PORT = process.env.PORT || 5070;
const ENV = process.env.ENV || 'DEVELOPMENT';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('common'));
app.use(cors());


app.set('port', PORT);
app.set('env', ENV);

app.use(router);

export default app;
