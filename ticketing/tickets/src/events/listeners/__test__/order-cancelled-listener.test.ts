import {OrderCreatedListener} from "../order-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import {OrderCreatedEvent, OrderStatus} from "@mp3por-tickets/common";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";
import {OrderCancelledListener} from "../order-cancelled-listener";
import {OrderCancelledEvent} from "@mp3por-tickets/common/build";

const setup = async () => {
    // create instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    // create and save the ticket
    const orderId = mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        price: 10,
        title: 'OMG',
        userId: '//.'
    })
    ticket.set({orderId: orderId});
    await ticket.save();

    // create fake data event
    const data: OrderCancelledEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
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

it('updates the ticket, published and acks', async ()=>{
    const { listener, data, msg, ticket} = await setup();
    
    await listener.onMessage(data, msg);
    
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})
