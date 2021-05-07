import {Listener, OrderCreatedEvent, Subjects} from "@mp3por-tickets/common/build";
import {Message, Stan} from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import {Ticket} from "../../models/ticket";
import {TicketUpdatedPublisher} from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{

    constructor(client: Stan) {
        super(client);
    }


    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        // find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        
        // mark the ticket as reserved
        ticket.set({orderId: data.id});
        
        // save the ticket
        await ticket.save()
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            version: ticket.version,
            userId: ticket.userId,
            orderId: ticket.orderId
        });
        
        // ack the msg
        msg.ack();
    }

    queueGroupName: string = queueGroupName;
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    
}
