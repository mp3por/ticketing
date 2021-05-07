import express, {Request, Response} from "express";
import {requireAuth} from "@mp3por-tickets/common";
import {Order} from "../models/orders";
import {body} from "express-validator";
import {NotAuthorizedError, NotFoundError, validateRequest} from "@mp3por-tickets/common/build";

const router = express.Router();

router.get('/api/orders/:orderId',
    [
        requireAuth,
    ],
    async (req: Request, res: Response) => {
        const order = await Order.findById(req.params.orderId).populate('ticket');
        
        if (!order) {
            throw new NotFoundError();
        }
        
        if (order.userId !== req.currentUser!.id) { 
            throw new NotAuthorizedError();
        }
        
        res.send(order);
    });

export {router as showOrderRouter};
