import { Router } from "express";
import authorize from './../middleware/auth.middleware.js';
import { createSubscription, getUserSubscriptions } from "../controllers/subscription.controllers.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", );
subscriptionRouter.get("/:id", );
subscriptionRouter.post("/", authorize, createSubscription);
subscriptionRouter.put("/:id", );
subscriptionRouter.delete("/:id", );
subscriptionRouter.get("/user/:id",authorize, getUserSubscriptions);
subscriptionRouter.put("/:id/cancel", );
subscriptionRouter.get("/upcoming-renewals",);

export default subscriptionRouter;