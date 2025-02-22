import {config} from 'dotenv';
config();
import jwt from 'jsonwebtoken';
import {User} from '../models/user.model.js';

const authorize = async (req, res, next) => {
    
    try {
        let token;

        // check if the token is in the header of the request
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        
        }

        // check if token is not 
        if (!token) {
            return res.status(401).json({message: 'Unauthorized - No token'});
        }

        // verify the token and get the user and find the user by id
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = User.findById(decoded.id);

        // check if the user is not found give an error message 
        if (!user) {
            return res.status(401).json({message: 'Unauthorized - No user'});
        }

        // attach the user to the request and call the next middleware
        req.user = user;
        next();

    } catch (error) {
        res.status(401).json({message: 'Unauthorized', error: error.message});
    }
};

export default authorize;