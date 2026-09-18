import mongoose from "mongoose";

import { ApiError } from "../utils/ApiError.js";

import { logger } from "../utils/logger.js";

const errorHandler = (err,req,res,next) =>{
    let error = err

    if(!(error instanceof ApiError)){
        const statusCode = error.statusCode || error instanceof mongoose.Error ? 400: 500

        const message = error.message || "soemthing went wrong"

        error = new ApiError(statusCode, message, error?.errors || [], err.stack)
    }

    const response={
        ...error,
        message: error.message,
        ...(process.env.NODE_ENV === "development" ? {stack: error.stack}:{})
    }

    logger.error(`${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    return res.status(error.statusCode).json(response)

}

export {errorHandler} 