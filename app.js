require('dotenv').config();
require('express-async-errors')

//extra security packages
const helmet=require('helmet');
const cors=require('cors');
const xss=require('xss-clean')
const rateLimiter=require('express-rate-limit')
const express = require('express');
const app = express();

//connectDB
const connectDB=require('./db/connect');
const authenticateuser=require('./middleware/authnetication');
//routes
const authRouter=require('./routes/auth')
const jobsRouter=require('./routes/jobs')

//error handler
const notFoundMiddleware=require('./middleware/not-found')
const errorMiddleware=require('./middleware/errorhandler')

app.set('trust proxy',1);
app.use(rateLimiter({
    windowMs:15*60*1000,//15 Minutes
    max:100 //Limit each IP to 100 request per windowMs
}));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
//routes

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',authenticateuser,jobsRouter)

app.use(errorMiddleware)
app.use(notFoundMiddleware)



const port=process.env.PORT || 5500

const start=async()=>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port,console.log(`server is listening on port ${port}...`))
    }catch(error){
        console.log(error)
    }
}
start()