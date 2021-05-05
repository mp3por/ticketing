/***
 * This is a publisher of NATS events
 *
 */

import nats from 'node-nats-streaming';

// stan = client
// 1. create nats client
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});

// we have to wait for the NATS to connect
// 2. connect to NATS
stan.on('connect', () => {
    console.log('Publisher connected to NATS');
    
    // we can only pass JSON data to the NATS
    const data = JSON.stringify({
        id: '123', 
        title: 'concert',
        price: 200
    });
    
    // channelName = subject in the NATS docs
    const channelName = 'ticket:created';
    stan.publish(channelName, data, () => {
        
        // Event = message in the NATS docs
        console.log('Event published');
    });
})
