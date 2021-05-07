import express, {Request, Response} from "express";
import {BadRequestError, OrderStatus, requireAuth, validateRequest} from "@mp3por-tickets/common";
import {body} from "express-validator";
import {Ticket} from "../models/ticket";
import {NotFoundError} from "@mp3por-tickets/common/build";
import {Order} from "../models/orders";

const router = express.Router();

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
        const existingOrder = Order.findOne({
            ticket: ticket,
            status: {'$in': [OrderStatus.Created,OrderStatus.AwaitingPayment, OrderStatus.Complete]}
        })
        
        if (existingOrder) {
            throw new BadRequestError('Ticket is already reserved');
        }
        
        // Calculate expiration date for this order
        
        // build and save the order
        
        // publish an event
        
        res.send({})
    });

export {router as newOrderRouter};
