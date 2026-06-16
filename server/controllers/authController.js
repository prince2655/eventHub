const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../utils/email');
// const { use } = require('react');
// Register user
const generateToken = (id,role) => {
    return jwt.sign({id,role},process.env.JWT_SECRET,{expiresIn:'1d'});
}

exports.registerUser = async (req,res) => {
    const{name,email,password}=req.body;

    let userExists=await User.findOne({email});
    if(userExists){
        return res.status(400).json({error:'User already exists'});
    }
    
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    try{
        const user=await User.create({name,email,password:hashedPassword,role:'user',isVerified:false});
        const otp=Math.floor(100000 + Math.random() * 900000).toString();
        
        /*console.log(`OTP for ${email}: ${otp}`);*/
        await OTP.create({email,otp,action:'account_verification'}); // OTP valid for 10 minutes
        await sendOTPEmail(email,otp,'account_verification');

        
        
        res.status(201).json({message:'User register successfully. Please check your email for OTP to verify your account.',
            email:user.email
        });


    }
    catch(error){
        res.status(400).json({error:error.message});
    }
    
}

//Login user

exports.loginUser=async(req,res)=>{
    const{email,password}=req.body;

    let user=await User.findOne({email});
    if(!user){
        return res.status(400).json({error:'Invalid credentials. Please Sign up first.'});
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({error:'Invalid credentials'});
    }

    if(!user.isVerified && user.role === 'user'){
        const otp=Math.floor(100000 + Math.random() * 900000).toString();
        await OTP.deleteMany({email,action:'account_verification'}); // Delete old OTPs for this email
        console.log(`OTP for ${email}: ${otp}`);
        await OTP.create({email,otp,action:'account_verification'});
        await sendOTPEmail(email,otp,'account_verification');
        return res.status(400).json({
            error:'Account not verified. A new OTP has been sent to your email.'
        });
    }

    res.json({
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
        token:generateToken(user._id,user.role)
    })

    
};

exports.verifyOtp=async(req,res)=>{
    const{email,otp}=req.body;
    const otpRecord=await OTP.findOne({email,otp,action:'account_verification'});

    if(!otpRecord){
        return res.status(400).json({error:'Invalid OTP'});
    }
    const user=await User.findOneAndUpdate({email},{isVerified:true});
    await OTP.deleteMany({email,action:'account_verification'}); // Delete OTP after successful verification
    res.json({
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
        token:generateToken(user._id,user.role)
    });
};