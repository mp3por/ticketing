/***
 * This is a listner of NATS events
 * 
 */
import nats, {Message, Stan} from 'node-nats-streaming';
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
    
    // // 3. create subscription on specific channel
    // const channelName = 'ticket:created';
    // const queueGroup = 'order-service-queue-group';
    // const options = stan.subscriptionOptions()
    //     // Setting ManualAck = true we tell the NATS to wait for manual acknowledgement that the event was processed. 
    //     // By default NATS marks every sent event as processed. 
    //     // We don't want this if we want to be sure the event was processed even if something goes wrong
    //     .setManualAckMode(true)
    //     // ensure a new listeners gets all events which were emitted
    //     // this is not really what we want because in 1 month this list will be enormous
    //     .setDeliverAllAvailable()
    //     // therefore we create a DurableSubscription 
    //     // NATS will use this name to note which events were already processed by the service
    //     // so that in case the service is down NATS knows exactly which events were missed 
    //     // and not send all events but only the missed ones
    //     // !!!! 
    //     // NOTE: in order for this to work I need to also set the QueueGroup when subscribing
    //     .setDurableName('order-service'); 
    //
    // const sub = stan.subscribe(channelName, queueGroup, options);
    //
    // // 4. listen for events on the channel
    // sub.on('message', (msg: Message) => {
    //     const data = msg.getData();
    //    
    //     if (typeof data === 'string') {
    //         console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    //     }
    //    
    //     // manual ack of the message
    //     msg.ack();
    // })
    
    new TicketCreatedListener(stan).listen();
});

// listen for PROGRAM CLOSE events to safe exit
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());


abstract class Listener {
    abstract subject: string;
    abstract queueGroupName: string;
    
    private client: Stan;
    protected ackWait = 5 * 1000;
    
    abstract onMessage(data: any, msg: Message): void

    constructor(client: Stan) {
        this.client = client;
    }
    
    subscriptionOptions() {
        return this.client.subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    }
    
    listen() {
        const sub = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );
        
        sub.on('message', (msg) => {
            console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);
            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        })
    }
    
    parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf8'));
    }

}

class TicketCreatedListener extends Listener {
    queueGroupName = 'payments-service';
    subject = 'ticket:created';

    onMessage(data: any, msg: Message): void {
        console.log('Event data!', data);
        
        msg.ack();
    }
    
}
