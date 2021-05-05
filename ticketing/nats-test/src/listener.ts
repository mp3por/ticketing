/***
 * This is a listner of NATS events
 * 
 */
import nats, {Message} from 'node-nats-streaming';
import {randomBytes} from "crypto";

// 1. create client
const clientId = randomBytes(4).toString('hex');
const stan = nats.connect('ticketing', clientId, {
    url: 'http://localhost:4222'
});

// 2. connect to NATS
stan.on('connect', ()=>{
    console.log('Listener connected to NATS');
    
    // 3. create subscription on specific channel
    const channelName = 'ticket:created';
    const queueGroup = 'order-service-queue-group'
    const sub = stan.subscribe(channelName, queueGroup);
    
    // 4. listen for events on the channel
    sub.on('message', (msg: Message) => {
        const data = msg.getData();
        
        if (typeof data === 'string') {
            console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
        }
    })
    
});

