const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const authRoutes=require('./routes/auth');
const eventRoutes=require('./routes/events');
const bookingRoutes=require('./routes/bookings');

dotenv.config();
const app=express(); 
app.use(cors());
app.use(express.json());

//routes
app.use('/api/auth',authRoutes);
app.use('/api/events',eventRoutes);
app.use('/api/bookings',bookingRoutes);


//connect to database
mongoose.connect(process.env.MONGO_URI,{
    // useNewUrlParser:true,
    // useUnifiedTopology:true
})
.then(()=>{
    console.log('Connected to MongoDB');
})
.catch((err)=>{
    console.error('Error connecting to MongoDB',err);
});

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`); 
}); 