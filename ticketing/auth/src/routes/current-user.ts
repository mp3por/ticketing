import express from "express";
import {currentUser} from '@mp3por-tickets/common';

const router = express.Router();

router.get(
    '/api/users/currentuser',
    currentUser,
    async (req, res)=>{
        res.send({currentUser : req.currentUser || null });
    }
);

export { router as currentUserRouter };
