import { config } from "dotenv";
config();
import { workflowClient } from "../config/upstash.js";
import {Subscription} from "../models/subscription.model.js";
// import User from "../models/user.model.js";

export const createSubscription = async (req, res, next) => {
    try {
        // console.log("User ID:", req.user._id); // Debug log
        const subscription = await Subscription.create({
            ...req.body,
            user: Subscription(req.user._id),
        });

        await workflowClient.trigger({
            url:`${process.env.SERVER_URL}`
        })

        res.status(201).json({ success: true, message: "Subscription created successfully", data: subscription });
    } catch (error) {
        console.log(`Error from createSubscription: ${error}`);
        next(error);
    }
};

export const getUserSubscriptions = async (req, res, next) => {
    try {
        if((req.user._id) !== (req.params.id)) {
            const error = new Error(`Unauthorized, you can only get your own subscriptions details ${(req.user._id)} !== ${req.params.id}`);
            error.statusCode = 401;
        }

        const subscriptions = await Subscription.find({ user:(req.params.id), message: "Subscriptions retrieved successfully" });

        if(subscriptions.length === 0) {
            const error = new Error("No subscriptions found");
            error.statusCode = 404;
        }

        res.status(200).json({ success: true, message: "Subscriptions retrieved successfully", data: subscriptions });
       

    } catch (error) {
        console.log(`Error from getUserSubscriptions: ${error}`);
        next(error);
    }
};


