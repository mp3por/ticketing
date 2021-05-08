import express, {Request, Response} from "express";
import {
    NotAuthorizedError,
    requireAuth,
    validateRequest,
    NotFoundError,
    OrderStatus,
    BadRequestError
} from "@mp3por-tickets/common";
import {body} from "express-validator";
import {Order} from "../models/order";
import {stripe} from "../stripe";
import {Payment} from "../models/payment";
import {PaymentCreatedPublisher} from "../events/pulishers/payment-created-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();

router.post(
    '/api/payments',
    [
        requireAuth,
        body('token').not().isEmpty().withMessage('token must be provided'),
        body('orderId').not().isEmpty().withMessage('orderId must be provided'),
        validateRequest
    ],
    async (req: Request, res: Response) => {
        
        const { orderId, token } = req.body;
        
        const order = await Order.findById(orderId);
        
        if (!order) {
            throw new NotFoundError();
        }
        
        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }
        
        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Order is cancelled');
        }
        
        const charge = await stripe.charges.create({
            currency: 'usd',
            amount: order.price * 100,
            source: token
        });
        
        const payment = Payment.build({
            orderId: order.id,
            stripeId: charge.id
        });
        await payment.save();
        
        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: order.id,
            stripeId: charge.id
        });
        
        res.status(201).send({id : payment.id});
    });

export {router as createChargeRouter};
