import {Listener, OrderCreatedEvent, Subjects} from "@mp3por-tickets/common/build";
import {Message} from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import {expirationQueue} from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log('Waiting for ', delay, ' to expire order ', data.id);
        
        await expirationQueue.add({
            orderId: data.id
        }, {
            delay: delay
        });
        
        msg.ack();
    }

    queueGroupName: string = queueGroupName;
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
