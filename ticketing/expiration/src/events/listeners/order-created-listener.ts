import {Listener, OrderCreatedEvent, Subjects} from "@mp3por-tickets/common/build";
import {Message} from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import {expirationQueue} from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        await expirationQueue.add({
            orderId: data.id
        }, {
            delay: 10000
        });
        
        msg.ack();
    }

    queueGroupName: string = queueGroupName;
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    
}
