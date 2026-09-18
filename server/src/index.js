import {app} from './app.js';
import dotenv from 'dotenv'
import connectDB from './db/index.js';

import dns from "dns";

dns.setServers(["1.1.1.1","8.8.8.8"]);

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 5000

import { logger } from './utils/logger.js';

connectDB().
then(()=>{
    app.listen(PORT,()=>{
        logger.info(`Server is running on port: ${PORT}`)
    })
})
.catch((err)=>{
    logger.error("mongodb is not working error", err)
})




