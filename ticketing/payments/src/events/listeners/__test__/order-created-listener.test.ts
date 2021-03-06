import {OrderCreatedListener} from "../order-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {OrderCreatedEvent, OrderStatus} from "@mp3por-tickets/common";
import mongoose, {set} from "mongoose";
import {Message} from "node-nats-streaming";
import {Order} from "../../../models/order";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);
    
    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: '',
        userId: 'omg',
        status: OrderStatus.Created,
        ticket: {
            id: 'omg',
            price: 10
        } 
    };
    
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };
    
    return { msg, listener, data};
    
};

it('replicates the order info', async () => {
    const { listener, msg, data } = await setup();
    
    await listener.onMessage(data, msg);
    
    const order = await Order.findById(data.id);
    
    expect(order!.price).toEqual(data.ticket.price);
});


it('acks the message', async () => {
    const { listener, msg, data } = await setup();

    await listener.onMessage(data, msg);
    
    expect(msg.ack).toHaveBeenCalled();
})
