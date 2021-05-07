import request from 'supertest';
import { app } from '../../app';
import {Ticket} from "../../models/ticket";

it('fetches the order', async ()=>{
    // Create a ticket
    const ticket = Ticket.build({
        title: 'OMG',
        price: 20
    });
    await ticket.save();
    
    const user = global.signin();
    // make a request to build an order
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId:ticket.id})
        .expect(201)
    
    // make a request to fetch the order
    const {body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200)
    
    expect(fetchedOrder.id).toEqual(order.id);
})

it('returns an error if user1 wants orders belonging to user2', async ()=>{
    // Create a ticket
    const ticket = Ticket.build({
        title: 'OMG',
        price: 20
    });
    await ticket.save();

    const user1 = global.signin();
    const user2 = global.signin();
    
    // make a request to build an order
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ticketId:ticket.id})
        .expect(201)

    // make a request to fetch the order
    const {body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user2)
        .send()
        .expect(401)
})
