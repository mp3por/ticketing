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
        

        res.status(201).send({});
    });

export {router as createChargeRouter};
