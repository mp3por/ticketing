import {Listener, OrderCancelledEvent, Subjects} from "@mp3por-tickets/common/build";
import {Message} from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import {Ticket} from "../../models/ticket";
import {TicketUpdatedPublisher} from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{

    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        // find the ticket
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket) {
            throw new Error('Ticket not found');
        }

        // mark the ticket as reserved
        ticket.set({orderId: undefined});

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
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

}
