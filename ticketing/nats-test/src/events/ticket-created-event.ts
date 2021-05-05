import {Subjects} from "./subjects";
import {Event} from './base-event';

/**
 * Describes how a TicketCreatedEvent looks like
 * */
export interface TicketCreatedEvent extends  Event{
    subject: Subjects.TicketCreated,
    data: {
        id: string;
        title: string;
        price: number;
    }
}
