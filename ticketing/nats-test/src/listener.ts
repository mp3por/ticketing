/***
 * This is a listner of NATS events
 * 
 */
import nats from 'node-nats-streaming';

// 1. create client
const stan = nats.connect('ticketing', '123', {
    url: 'http://localhost:4222'
});

// 2. connect to NATS
stan.on('connect', ()=>{
    console.log('Listener connected to NATS');
    
    // 3. create subscription on specific channel
    const channelName = 'ticket:created';
    const sub = stan.subscribe(channelName);
    
    // 4. listen for events on the channel
    sub.on('message', (msg) => {
        console.log('Message received');
    })
    
});

