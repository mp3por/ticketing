import {Publisher, Subjects, TicketCreatedEvent} from "@mp3por-tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
