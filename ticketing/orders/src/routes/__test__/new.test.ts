import request from 'supertest';
import {app} from '../../app';
import mongoose from "mongoose";
import {Ticket} from "../../models/ticket";
import {Order} from "../../models/orders";
import {OrderStatus} from "@mp3por-tickets/common";
import {natsWrapper} from "../../nats-wrapper";

it('returns an error if the ticket does not exist', async () => {
    // create randomg new ObjectId
    const ticketId = mongoose.Types.ObjectId();
    
    // ask the app to create an order for it
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticketId
        })
        .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
        price: 20,
        title: 'concert'
    });
    await ticket.save();
    
    const order = Order.build({
        ticket: ticket,
        expiresAt: new Date(),
        userId: 'omg',
        status: OrderStatus.Created
    });
    await order.save();
    
    // ask the app to create an order for it
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticket.id
        })
        .expect(400);
});

it('reserves a ticket', async () => {
    const ticket = Ticket.build({
        price: 20,
        title: 'concert'
    });
    await ticket.save();

    // ask the app to create an order for it
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticket.id
        })
        .expect(201);
})

it('emits an order created event', async ()=>{
    const ticket = Ticket.build({
        price: 20,
        title: 'concert'
    });
    await ticket.save();

    // ask the app to create an order for it
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticket.id
        })
        .expect(201);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})
