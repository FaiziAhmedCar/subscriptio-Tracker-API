import { config } from 'dotenv';
config();
import express from 'express';

const app = express();
const Port = process.env.PORT;
app.get('/', (req, res) => {
    res.send('Welcome to the Subscription Tracker API!');
    });

app.listen(Port, () => {
    console.log(`Server is running on port http://localhost:${Port}`);
});