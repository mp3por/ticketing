import Queue from 'bull';

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

// 
expirationQueue.process(async (job)=>{
   console.log('I want to publish an expiration:complete event for orderId: ', job.data.orderId ); 
});

export { expirationQueue };
