import {natsWrapper} from "../../../nats-wrapper";
import {OrderCancelledEvent, OrderStatus} from "@mp3por-tickets/common";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";
import {Order} from "../../../models/order";
import {OrderCancelledListener} from "../order-cancelled-listener";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    
    const order = Order.build({
        version: 0,
        id: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        userId: 'omg',
        price: 10
    });
    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: order.version + 1,
        ticket: {
            id: 'omg'
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { msg, listener, data, order};

};

it('updates the status of the order', async () => {
    const { listener, msg, data, order } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});


it('acks the message', async () => {
    const { listener, msg, data } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})
