/**
 * List of all possible subjects (channel-names)
 * to ensure we don't make typos when we create our events
 * */

export enum Subjects {
    TicketCreated = 'ticket:created',
    OrderUpdate = 'order:updated'
}
