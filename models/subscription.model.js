import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
        index: true,
    },
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
        required: [true, "Currency is required  chose from the following: USD, EUR, GBP, INR, YUAN, YEN, FRANC, PESO, REAL, RUBLE, LIRA, POUND, DOLLAR, EURO, YUAN, YEN, FRANC, PESO, REAL, RUBLE, LIRA, POUND"],
        enum: ["USD", "EUR", "GBP", "INR", "YUAN", "YEN", "FRANC", "PESO", "REAL", "RUBLE", "LIRA", "POUND", "DOLLAR", "EURO", "YUAN", "YEN", "FRANC", "PESO", "REAL", "RUBLE", "LIRA", "POUND"],
        default: "INR",
    },
    frequency: {
        type: String,
        required: [true, "Frequency is required chose from the following: daily, weekly, monthly, annually"],
        enum: ["daily", "weekly", "monthly", "annually"],
        default: "monthly",
    },
    category: {
      type: String,
        required: [true, "Category is required  chose from the following: food, clothing, electronics, books, other, sports, news, entertainment, education, health, fitness, other"],
        enum: ["food", "clothing", "electronics", "books", "other", "sports", "news", "entertainment", "education", "health", "fitness", "other"],
        default: "other",  
    },
    paymentMethod: {
        type: String,
        required: [true, "Payment method is required  choose from the following: credit card, debit card, paypal, other"],
        enum: ["credit card", "debit card", "paypal", "other"],
        default: "credit card",
    },
    status: {
        type: String,
        required: [true, "Status is required   choose from the following: active, canceled, trial, pending"],
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
}, {timestamps: true});

// auto calculate renewal date
subscriptionSchema.pre("save", function(next){
    if(!this.renewalDate){
        const renewalPeriod = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            annually: 365,
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriod[this.frequency]);
    }
    // auto update the status if the renewal date is in the past
    if(this.renewalDate < new Date()){
        this.status = "expired";
    }
    next();
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
// export default Subscription;