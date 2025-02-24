
import {serve} from "@upstash/workflow";
import { Subscription } from "../models/subscription.model";
import dayjs from "dayjs";

export const sendingReminder= serve(async(context)=>{
    const {subscriptionId} = context.requestPayload;
    const subscription = await fetchSubscription(constext, subscriptionId);

    if(!subscription || subscription.status !== 'active') return;

    const renewalDate=dayjs(subscription.renewalDate);

    if(renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription ${subscriptionId}.Stopping workflow.`);
        return;
    }
    for (const daysBefore of REMINDERS){
        const reminderDate= renewalDate.subtract(daysBefore, 'days');
        if(reminderDate.isBefore(dayjs())) {
            await sleepUntilReminder(context,`Reminder ${daysBefore} days Before`, reminderDate)
        }
        await triggerRemainder(context,`Reminder ${daysBefore} days Before`)
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', ()=>{
        return Subscription.findById(subscriptionId).populate('user','name email');
    })
};



const sleepUntilReminder = async (context, label, date)=>{
    console.log(`Sleeping until ${label} date ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerRemainder= async(context, label )=>{
    return await context.run(label,()=>{
        console.log(`Triggering ${label} reminder`);

    })
}