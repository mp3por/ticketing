import request from 'supertest';
import {Ticket} from "../../models/ticket";
import {app} from "../../app";
import {OrderStatus} from "@mp3por-tickets/common";
import {Order} from "../../models/orders";
import {natsWrapper} from "../../nats-wrapper";

it('marks an order as Cancelled', async ()=>{
    // create a ticket
    const ticket = Ticket.build({
        price:200,
        title: 'OMG'
    });
    await ticket.save();
    
    const user = global.signin();
    // make a request to create an order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);
    
    // make a request to cancel an order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);
    
    const updatedOrder = await Order.findById(order.id);
    
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    
})


it('emits an OrderCancelled event', async ()=>{
    // create a ticket
    const ticket = Ticket.build({
        price:200,
        title: 'OMG'
    });
    await ticket.save();

    const user = global.signin();
    // make a request to create an order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);

    // make a request to cancel an order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})
