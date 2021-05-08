import express, {Request, Response} from "express";
import {BadRequestError, OrderStatus, requireAuth, validateRequest} from "@mp3por-tickets/common";
import {body} from "express-validator";
import {Ticket} from "../models/ticket";
import {NotFoundError} from "@mp3por-tickets/common/build";
import {Order} from "../models/orders";
import {OrderCreatedPublisher} from "../events/publishers/order-created-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOWS_SECONDS = 1;

router.post(
    '/api/orders',
    [
        requireAuth,
        body('ticketId').not().isEmpty().withMessage('TicketId must be provided'),
        validateRequest
    ],
    async (req: Request, res: Response) => {
        const { ticketId } = req.body;
        // find the ticket the user is trying to order in the database
        const ticket = await Ticket.findById(ticketId);
        
        if (!ticket) {
            throw new NotFoundError();
        }
        
        // Make sure this ticket is not already reserved
        const isReserved = await ticket.isReserved();
        if (isReserved) {
            throw new BadRequestError('Ticket is already reserved');
        }
        
        // Calculate expiration date for this order
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOWS_SECONDS);
        
        // build and save the order
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket: ticket
        });
        await order.save();
        // console.log('created order ', order)
        
        // publish an event
        await new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            version: order.version,
            ticket: {
                id: order.ticket.id,
                price: order.ticket.price
            },
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString()
        });
        
        res.status(201).send(order);
    });

export {router as newOrderRouter};
