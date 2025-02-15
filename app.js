import { config } from 'dotenv';
config();
import express from 'express';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import userRouter from './routes/user.routes.js';
import connectDB from './database/mongodb.js';
import errorMiddleware from './middleware/error.middleware.js';
import cookieParser from 'cookie-parser';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const Port = process.env.PORT;

app.use('/api/v1/auth', authRouter);          // http://localhost:3000/api/v1/auth   with /sign-up, /sign-in, /sign-out
app.use('/api/v1/subscriptions', subscriptionRouter);   // http://localhost:3000/api/v1/subscriptions with /, /:id
app.use('/api/v1/users', userRouter);   // http://localhost:3000/api/v1/users with /, /:id

// error middleware implementation
app.use(errorMiddleware);


// default route
app.get('/', (req, res) => {
    res.send('Welcome to the Subscription Tracker API!');
    });

// start the server
app.listen(Port, async () => {
    console.log(`Server is running on port http://localhost:${Port}`);
    // connect to the database
    await connectDB();
});