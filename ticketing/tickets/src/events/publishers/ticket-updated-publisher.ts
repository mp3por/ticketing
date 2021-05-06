import {Publisher, Subjects, TicketUpdatedEvent} from "@mp3por-tickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
