import {OrderCreatedListener} from "../order-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import {OrderCreatedEvent, OrderStatus} from "@mp3por-tickets/common/build";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";

const setup = async () => {
    // create instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);
    
    // create and save the ticket
    const ticket = Ticket.build({
        price: 10,
        title: 'OMG',
        userId: '//.'
    })
    await ticket.save();
    
    // create fake data event
    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'omg',
        expiresAt: 'omg',
        ticket: {
            price: ticket.price,
            id: ticket.id
        }
    };
    
    // fake msg object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    
    return { listener, data, msg, ticket};
}

it('sets userId of the ticket', async ()=>{
    const { listener, msg, data, ticket } = await setup();
    
    await listener.onMessage(data, msg);
    
    const updatedTicket = await Ticket.findById(ticket.id);
    
    expect(updatedTicket!.orderId).toEqual(data.id);
    
});

it('acks the message', async ()=>{
    const { listener, msg, data, ticket } = await setup();

    await listener.onMessage(data, msg);
    
    expect(msg.ack).toHaveBeenCalled();
})

it('publishes a ticket updated event', async ()=>{
    const { listener, msg, data, ticket } = await setup();

    await listener.onMessage(data, msg);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    
    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(ticketUpdatedData.orderId).toEqual(data.id);
})
