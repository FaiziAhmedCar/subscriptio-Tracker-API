import mongoose from "mongoose";
import {User} from './../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {config} from 'dotenv';
config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// Implement sign-up logic
export const signUp = async (req, res, next) => {

    // this logic is known as Atomic Operation where operations are either fully completed or not at all
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // logic to create a new user
        const { name, email, password } = req.body;

        // if(!name || !email || !password){
        //     return res.status(400).json({message: 'All fields are required'});
        // }
        if(!name){
            return res.status(400).json({message: 'Name is required'});
        }
        if(!email){
            return res.status(400).json({message: 'Email is required'});
        }
        if(!password){
            return res.status(400).json({message: 'Password is required'});
        }
        
        // check if the user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({message: 'User already exists'});
        }
        // if the user does not exist, Hash the password for new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create a new user
        const newUsers=  await User.create([{name, email, password : hashedPassword}], {session});
        const token = jwt.sign({userId:newUsers[0]._id},JWT_SECRET,{expiresIn: JWT_EXPIRES_IN});

        
        await session.commitTransaction();
        session.endSession();

        // return the token
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
            token,
            user: newUsers[0],
        }
        });


    } catch (error) {
        // if an error occurs, abort the transaction and throw the error
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

// Implement sign-in logic
export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: 'User not found OR email is incorrect'});
        }

        // compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({message: 'Invalid password'});
        }

        // create a token if the password is valid
        const token = jwt.sign({UserId:user._id},JWT_SECRET,{expiresIn: JWT_EXPIRES_IN});
        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                token,
                user: user,
            }
        });


    } catch (error) {
        next(error);
    }
}

// Implement sign-out logic
export const signOut = async (req, res, next) => {
    
}
