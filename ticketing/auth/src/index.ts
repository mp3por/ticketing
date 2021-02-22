import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import {currentUserRouter} from "./routes/current-user";
import {signUpRouter} from "./routes/signup";
import {signInRouter} from "./routes/signin";
import {signOutRouter} from "./routes/signout";
import {errorHandler} from "./middlewares/error-handler";
import {NotFoundError} from "./errors/not-found-error";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.use(errorHandler);

app.all('*', async (req, res) => {
    throw new NotFoundError();
} )

app.listen(3000, ()=>{
    console.log('Listening on 3000');
});