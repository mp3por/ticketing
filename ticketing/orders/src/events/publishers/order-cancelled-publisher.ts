import {OrderCancelledEvent, Publisher, Subjects} from "@mp3por-tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
