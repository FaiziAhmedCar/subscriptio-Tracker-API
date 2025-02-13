import mongoose from "mongoose";
import { name } from './../node_modules/eslint/lib/rules/utils/ast-utils';
import { validate } from './../node_modules/@types/json-schema/index.d';

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minLength: [3, "Name must be at least 3 characters long"],
        maxLength: [50, "Name must be less than 50 characters long"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be a positive number"],
    },
    currency: {
        type: String,
        required: [true, "Currency is required"],
        enum: ["USD", "EUR", "GBP", "RUPEES", "YUAN", "YEN", "FRANC", "PESO", "REAL", "RUBLE", "LIRA", "POUND", "DOLLAR", "EURO", "YUAN", "YEN", "FRANC", "PESO", "REAL", "RUBLE", "LIRA", "POUND"],
        default: "RUPEES",
    },
    frequency: {
        type: String,
        required: [true, "Frequency is required"],
        enum: ["daily", "weekly", "monthly", "annually"],
        default: "monthly",
    },
    category: {
      type: String,
        required: [true, "Category is required"],
        enum: ["food", "clothing", "electronics", "books", "other", "sports", "news", "entertainment", "education", "health", "fitness", "other"],
        default: "other",  
    },
    paymentMethod: {
        type: String,
        required: [true, "Payment method is required"],
        enum: ["credit card", "debit card", "paypal", "other"],
        default: "credit card",
    },
    status: {
        type: String,
        required: [true, "Status is required"],
        enum: ["active", "canceled", "trial", "pending"],
        default: "pending",
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"],
        validate:{
            validator:(value)=> value <= new Date(),
        },
        message: "Start date must be in the past",    
    },
    renewalDate: {
        type: Date,
        // required: [true, "Renewal date is required"],
        validate:{
            validator:(value)=> value > this.startDate,
        },
        message: "Renewal date must be after start date",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
        index: true,
    },
}, {timestamps: true});

// auto calculate renewal date
subscriptionSchema.pre("save", function(next){
    if(!this.renewalDate){
        const renewalPeriod = {
            daily: 1,
            weekly: 7,
            monthly: 1,
            annually: 12,
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setMonth(this.renewalDate.getMonth() + renewalPeriod[this.frequency]);
    }
});