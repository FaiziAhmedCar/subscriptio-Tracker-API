import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
    try {
        // console.log("User ID:", req.user._id); // Debug log
        const subscription = await Subscription.create({
            ...req.body,
            user: Subscription(req.user._id),
        });

        res.status(201).json({ success: true, message: "Subscription created successfully", data: subscription });
    } catch (error) {
        console.log(`Error from createSubscription: ${error}`);
        next(error);
    }
};