import {TicketCreatedListener} from "../ticket-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {ExpirationCompleteEvent, OrderStatus} from "@mp3por-tickets/common";
import mongoose, {set} from "mongoose";
import {Message} from "node-nats-streaming";
import {Ticket} from "../../../models/ticket";
import {Order} from "../../../models/orders";
import {ExpirationCompleteListener} from "../expiration-complete-listener";

const setup = async () => {
    // create an instance of the listener
    const listener = new ExpirationCompleteListener(natsWrapper.client);
    
    // create ticket
    const ticket = Ticket.build({
        title: 'OMG',
        price: 10,
        id: mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();
    
    // create order
    const order = Order.build({
        userId: 'omg',
        ticket: ticket,
        expiresAt: new Date(),
        status: OrderStatus.Created
    });
    await order.save();
    
    // create fake data event
    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    };
    
    // create fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg, ticket, order };
}

it('updates the order status to cancelled', async ()=>{
    const { listener, ticket, order, msg, data } = await setup();
    
    await listener.onMessage(data, msg);
    
    const updatedOrder = await Order.findById(order.id);
    
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});


it('emit event OrderCancelled', async ()=>{
    const { listener, ticket, order, msg, data } = await setup();

    await listener.onMessage(data, msg);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    
    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);
});


it('ack the msg', async ()=>{
    const { listener, ticket, order, msg, data } = await setup();

    await listener.onMessage(data, msg);
    
    expect(msg.ack).toHaveBeenCalled();
});

it('does not cancell completed order', async ()=>{
    const { listener, ticket, order, msg, data } = await setup();
    
    order.set({status: OrderStatus.Complete});
    await order.save();

    await listener.onMessage(data, msg);
    
    const updatedOrder = await Order.findById(order.id);
    
    expect(msg.ack).toHaveBeenCalled();
    expect(updatedOrder!.status).toEqual(OrderStatus.Complete);
});
