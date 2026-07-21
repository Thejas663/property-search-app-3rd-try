import express from 'express';
import { sendContactEmail } from '../controller/contact.js';

const ContactRouter = express.Router();

ContactRouter.post('/', sendContactEmail);

export default ContactRouter;
