import {Listener, Subjects, TicketUpdatedEvent} from "@mp3por-tickets/common/build";
import {queueGroupName} from "./queue-group-name";
import {Message, Stan} from "node-nats-streaming";
import {Ticket} from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {

    constructor(client: Stan) {
        super(client);
    }
    
    async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
        const ticket = await Ticket.findByEvent(data);
        
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        
        const { title, price } = data;
        ticket.set({title, price});
        await ticket.save();
        
        msg.ack();
    }

    queueGroupName: string = queueGroupName;
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    
}
