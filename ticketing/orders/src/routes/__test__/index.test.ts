import request from 'supertest';
import {app} from '../../app';
import {Ticket} from "../../models/ticket";
import mongoose from "mongoose";

const buildTicket = async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 20,
        title: 'OMG'
    });
    await ticket.save();
    return ticket;
}

it('fetches orders for a particular user', async () => {
    // create 3 tickets
    const ticket1 = await buildTicket();
    const ticket2 = await buildTicket();
    const ticket3 = await buildTicket();
    
    const user1 = global.signin();
    const user2 = global.signin();
    
    // create 1 order as User1
    await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ticketId: ticket1.id})
        .expect(201);
    
    // create 2 orders as User2
    const {body:order1} =await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ticketId: ticket2.id})
        .expect(201);
    const {body:order2} =await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ticketId: ticket3.id})
        .expect(201);

    // Make request for User2
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', user2)
        .expect(200);
    // Make sure we got order only for User2
    
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(order1.id);
    expect(response.body[1].id).toEqual(order2.id);

});
