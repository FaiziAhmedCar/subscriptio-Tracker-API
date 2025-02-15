import mongoose from "mongoose";
import User from './../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {config} from 'dotenv';
config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const signUp = async (req, res, next) => {
    // Implement sign-up logic

    // this logic is known as Atomic Operation where operations are either fully completed or not at all
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // logic to create a new user
        const {name, email, password} = req.body;

        // check if the user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({message: 'User already exists'});
        }
        // if the user does not exist, Hash the password for new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create a new user
        const newUsers= new User([{name, email, password: hashedPassword}], {session: session});
        const token = jwt.sign({userId:newUsers._id},JWT_SECRET,{expiresIn: JWT_EXPIRES_IN});
        
        await session.commitTransaction();
        session.endSession();

        // return the token
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
            token,
            user: newUsers[0]
        }
        });


    } catch (error) {
        // if an error occurs, abort the transaction and throw the error
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    // Implement sign-in logic
}

export const signOut = async (req, res, next) => {
    // Implement sign-out logic
}
