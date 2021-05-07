import express, {Request, Response} from "express";
import {OrderStatus, requireAuth} from "@mp3por-tickets/common";
import {Order} from "../models/orders";
import {NotAuthorizedError, NotFoundError} from "@mp3por-tickets/common/build";

const router = express.Router();

router.delete('/api/orders/:orderId',
    [
        requireAuth
    ],
    async (req: Request, res: Response) => {
        const { orderId } = req.params;
        
        const order = await Order.findById(orderId);
        
        if (!order) {
            throw new NotFoundError();
        }
        
        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }
        
        order.status = OrderStatus.Cancelled;
        await order.save();
        
        // publish event
        
        res.status(204).send(order);
    });

export {router as deleteOrderRouter};
