import { Router } from "express";
import { getUsers, getUser} from "../controllers/user.controllers.js";
import authorize  from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", authorize, getUser);
userRouter.post("/",);
userRouter.delete("/:id", );

export default userRouter;