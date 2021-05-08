import {ExpirationCompleteEvent, Listener, OrderStatus, Subjects} from "@mp3por-tickets/common";
import {Message} from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import {Order} from "../../models/orders";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderId);
        
        if (!order) {
            throw new Error('order not found');
        }
        
        order.set({
            status: OrderStatus.Cancelled
        });
        await order.save()
    }

    queueGroupName: string = queueGroupName;
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    
}
