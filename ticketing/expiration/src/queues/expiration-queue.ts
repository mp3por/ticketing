import Queue from 'bull';
import {ExpirationCompletePublisher} from "../events/publishers/expiration-complete-publisher";
import {natsWrapper} from "../nats-wrapper";

// define what is in the queue data
interface Payload {
    orderId: string;
}

// create queue
const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
});

// defines how to process the job
expirationQueue.process(async (job)=>{
   await new ExpirationCompletePublisher(natsWrapper.client).publish({
       orderId: job.data.orderId
   })
});

export { expirationQueue };
