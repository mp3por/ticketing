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
    
    stan.on('close', () => {
       console.log('NATS connection closed!');
       process.exit();
    });
    
    // 3. create subscription on specific channel
    const channelName = 'ticket:created';
    const queueGroup = 'order-service-queue-group';
    const options = stan.subscriptionOptions()
        // Setting ManualAck = true we tell the NATS to wait for manual acknowledgement that the event was processed. 
        // By default NATS marks every sent event as processed. 
        // We don't want this if we want to be sure the event was processed even if something goes wrong
        .setManualAckMode(true); 
    
    const sub = stan.subscribe(channelName, queueGroup, options);
    
    // 4. listen for events on the channel
    sub.on('message', (msg: Message) => {
        const data = msg.getData();
        
        if (typeof data === 'string') {
            console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
        }
        
        // manual ack of the message
        msg.ack();
    })
    
});

// listen for PROGRAM CLOSE events to safe exit
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
