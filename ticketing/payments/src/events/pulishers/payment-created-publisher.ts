import {PaymentCreatedEvent, Publisher, Subjects} from "@mp3por-tickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
