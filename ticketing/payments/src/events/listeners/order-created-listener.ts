import {Listener, OrderCreatedEvent, Subjects} from "@mp3por-tickets/common";
import {Message} from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import {Order} from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const order = Order.build({
            id: data.id,
            status: data.status,
            version: data.version,
            userId: data.userId,
            price: data.ticket.price
        });
        await order.save();
        
        msg.ack();
    }

    queueGroupName: string = queueGroupName;
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    
}
