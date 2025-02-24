import {User} from "../models/user.model.js";


// for retrieving more than one user
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users,
        });
    } catch (error) {
        next(error);
    }
}

// for retrieving a single user
export const getUser = async (req, res, next) => {
    try {
        const user= await User.findById(req.params.id).select('-password');
        if(!user){ 
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: user,
        });
    } catch (error) {
        next(error);
        
    }
}
