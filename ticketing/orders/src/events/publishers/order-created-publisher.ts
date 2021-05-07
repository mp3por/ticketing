import {OrderCreatedEvent, Publisher, Subjects} from "@mp3por-tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
