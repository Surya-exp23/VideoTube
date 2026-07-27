import {app} from './app.js';
import dotenv from 'dotenv'
import connectDB from './db/index.js';

import dns from "dns";

dns.setServers(["1.1.1.1","8.8.8.8"]);

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 5000

connectDB().
then(()=>{
    app.listen(5000,()=>{
        console.log(`console is running on port: ${PORT}`)
    })
})
.catch((err)=>{
    console.log("mongodb is not working error", err)
})




