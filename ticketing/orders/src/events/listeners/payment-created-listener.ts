import {Listener, OrderStatus, PaymentCreatedEvent, Subjects} from "@mp3por-tickets/common";
import { queueGroupName } from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {Order} from "../../models/orders";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderId);
        
        if (!order) {
            throw new Error('Order not found');
        }
        
        order.set({
            status: OrderStatus.Complete
        });
        await order.save();
        
        // we are not publishing an OrderUpdated event here because we assume 
        // that once the order is in Complete state nothing else will modify it
        
        msg.ack();
    }

    queueGroupName: string = queueGroupName;
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    
}
