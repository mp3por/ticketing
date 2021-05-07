import {TicketCreatedListener} from "../ticket-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {TicketCreatedEvent} from "@mp3por-tickets/common/build";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";
import {Ticket} from "../../../models/ticket";

const setup = async () => {
    // create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);
    // create fake data event
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        userId:  new mongoose.Types.ObjectId().toHexString(),
        price: 10,
        title: 'OMG'
    };
    // create fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
}


it('creates and saves a ticket', async ()=>{
    const { listener, data, msg } = await setup();

    // call onMessage function
    await listener.onMessage(data, msg);

    // assert ticket was created
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async ()=> {
    const {listener, data, msg} = await setup();

    // call onMessage function
    await listener.onMessage(data, msg);

    // assert ack to have been called
    expect(msg.ack).toHaveBeenCalled();
});
