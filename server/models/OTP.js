const mongoose=require('mongoose');

const OTPSchema=new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true,
        enum:['account_verification','event_booking'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // OTP expires after 5 minutes
    }
});

module.exports=mongoose.model('OTP',OTPSchema);