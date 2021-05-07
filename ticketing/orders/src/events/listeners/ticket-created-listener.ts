import {Message, Stan} from "node-nats-streaming";
import {Listener, Subjects, TicketCreatedEvent} from "@mp3por-tickets/common/build";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {

    constructor(client: Stan) {
        super(client);
    }
    
    async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
        const { id, title, price } = data;
        
        const ticket = Ticket.build({
           id, title, price
        });
        await ticket.save();
        
        msg.ack();
    }

    queueGroupName: string = queueGroupName;
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    
}
