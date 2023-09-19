const {CustomAPIError}=require('../error')
const {StatusCodes}=require('http-status-codes')
const errorHandlerMiddleware=(err,req,res,next)=>{

    let customError={
        statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg:err.message || "Something went Wrong please try again later"
    }
    if(err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({msg:err.message})
    }
    //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Something Went Wrong"})
    if(err.code && err.code===11000){
        customError.msg=`Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
        customError.statusCode=400;
    }
    return res.status(customError.statusCode).json({msg:customError.msg})
}

module.exports=errorHandlerMiddleware;