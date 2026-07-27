import {app} from './app.js';
import dotenv from 'dotenv'

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 5000
app.listen(5000,()=>{
    console.log(`console is running on port: ${PORT}`)
})

