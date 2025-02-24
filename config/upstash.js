import {Client as WorkflowClient} from '@upstash/workflow';
import {config} from 'dotenv';
config();

export const workflowClient = new WorkflowClient({
    baseUrl: process.env.UPSTASH_URL,
    token: process.env.UPSTASH_TOKEN
});


