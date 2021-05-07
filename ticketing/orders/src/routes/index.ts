import express, {Request, Response} from "express";
import {requireAuth, validateRequest} from "@mp3por-tickets/common";
import {body} from "express-validator";
import {Order} from "../models/orders";

const router = express.Router();

router.get('/api/orders',
    [
        requireAuth
    ],
    async (req: Request, res: Response) => {
        // get all orders for the user
        const orders = await Order.find({
            userId: req.currentUser!.id
        }).populate('ticket');

        res.send(orders);
    }
);

export {router as indexOrderRouter};
