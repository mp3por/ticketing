import {natsWrapper} from "../../../nats-wrapper";
import { TicketUpdatedEvent} from "@mp3por-tickets/common/build";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";
import {Ticket} from "../../../models/ticket";
import {TicketUpdatedListener} from "../ticket-updated-listener";

const setup = async () => {
    // create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client);
    
    // create a ticket
    const ticket = Ticket.build({
        title: 'OMg',
        price: 10,
        id: mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();
    
    // create fake data event
    const data: TicketUpdatedEvent['data'] = {
        version: ticket.version + 1,
        id: ticket.id,
        userId: mongoose.Types.ObjectId().toHexString(),
        price: 100,
        title: 'OMGtgg'
    };
    // create fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };
    
    return { listener, data, ticket, msg };
}


it('finds, creates and updates a ticket', async ()=>{
    const { listener, data, ticket, msg } = await setup();
    
    // call onMessage function
    await listener.onMessage(data, msg);
    
    // assert ticket was created
    const updatedTicket = await Ticket.findById(ticket.id);
    
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
});

it('acks the message', async ()=> {
    const {listener, data, msg} = await setup();

    // call onMessage function
    await listener.onMessage(data, msg);

    // assert ack to have been called
    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event is out of order', async ()=>{
    const {msg, data, listener, ticket} = await setup();
    
    data.version = 10;
    
    try{
        await listener.onMessage(data, msg);
    } catch (e) {
        
    }
    
    expect(msg.ack).not.toHaveBeenCalled();
    
})
