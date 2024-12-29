const Joi = require('joi');
const User  = require('../models/User');
const bcrypt = require('bcryptjs');
const JWTService = require('../services/JWTService');
const RefreshToken = require('../models/token')

const authController ={
    
    async register (req,res,next) {

        //1. validate the user inputs

        const userRegisterSchema = Joi.object({
            firstName : Joi.string().max(30).required(),
            lastName : Joi.string().max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        })
        const {error} = userRegisterSchema.validate(req.body);

        //2. if error in the validataion ->return error to the middlewares

        if(error){
            return next(error);
        }

        //3. if email and password is already registered -> return an error
        const {email,firstName,lastName,password} = req.body;
        try{
            const emailInUSe = await User.exists({email});

            if (emailInUSe){
                const error = {
                    status:409,
                    message : 'Email already in use, try another email...!'
                }
                return next(error);
            }

        }
        catch(error){
            return next(error);
        }

        //4. password hash
        const passwordHash = await bcrypt.hash(password, 10);

        //5. store user data in DB
        let accessToken;
        let refreshToken;
        let user;
        try{
            const userToRegister = new User({
                firstName:firstName,
                lastName:lastName,
                password:passwordHash,
                email:email,
            });
    
             user =await userToRegister.save();

            //token Generation
            accessToken = JWTService.SignAccessToken({_id : user._id},'30m');
            refreshToken = JWTService.SignRefreshToken({_id:user._id},'60m');
        }
        catch(error){
                return next(error);
        }
        //store refresh token in db
       await JWTService.StoreRefreshToken(refreshToken,user._id);

        res.cookie('accessToken',accessToken,{
            maxAge:1000*60*60*24,
            httpOnly:true
        });

        res.cookie('refreshToken',refreshToken,{
            maxAge:1000*60*60*24,
            httpOnly: true
        });
       
        //6. res send
        res.status(201).json({user:user,  auth:true});
    },    
    


    async login (req,res,next) {

        //1. validate the user inputs

        const loginUser = Joi.object({
            email: Joi.string().email().required(),
            password : Joi.string().required(),
        })
        const {error} = loginUser.validate(req.body);

        //2. if error, throm error to the middleware

        if(error){
            return next(error);
        }

        //3. match the credentials
        const {email,password} = req.body;

        let user;
        try{
             user = await User.findOne({email:email});
            if(!user){
                const error = {
                    status : 409,
                    message : "Invalid email",
                }
                return next(error);
            }
            const match = await bcrypt.compare(password,user.password);
            if(!match){
                const error={
                    status:409,
                    message:"Invalid password"
                }
                return next(error);
            }
        }
        catch(error){
            return next(error);
        }

        const accessToken = JWTService.SignAccessToken({_id:user._id},'30m');
        const refreshToken = JWTService.SignRefreshToken({_id:user._id},'30m')

        //store token in DB
        try{
            RefreshToken.updateOne({
                _id:user._id
            },
            {token:refreshToken},
            {upsert:true}
            );
        }
        catch(error){
            return next(error);
        }
        
        res.cookie('accessToken',accessToken,{
            maxAge:1000*60*60*24,
            httpOnly:true
        });

        res.cookie('refreshToken',refreshToken,{
            maxAge:1000*60*60*24,
            httpOnly: true
        });

        //4. send response
        res.status(200).json({user:user,  auth:true});
    },

    async logout(req,res,next){

        const {refreshToken}= req.cookies;

        //delete the refresh token from DB
        try {
            RefreshToken.deleteOne({token:refreshToken})

        } catch (error) {
            return next(error);
        }

        //delete the cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        //send response
        res.status(200).json({user:null, auth:false})
    },

    async refresh (req,res,next){


        // get the refreshToken
        const orignalRefreshToken = req.cookies.refreshToken;


        // verify the refresh token
        let id;
        try {
            id = JWTService.VerifyRefreshToken(orignalRefreshToken)._id;
          
            
        } catch (e) {
            const error ={
                status : 401,
                message:"Unauthorized",
            }
            return next(error);
        }
        try {
            const match = RefreshToken.findOne({_id:id,token:orignalRefreshToken});
            if(!match){
                error={
                    status:401,
                    message:"Unauthorized"
                }
                return (error);
            }
            
        } catch (e) {
            return next(e);
        }


        //get new tokens
       try {
        const accessToken = JWTService.SignAccessToken({_id:id},'30m');
        const refreshToken = JWTService.SignRefreshToken({_id:id},'60m');

        //store in DB
        await RefreshToken.updateOne({_id:id},{token:refreshToken});
        res.cookie('accessToken',accessToken,{
            maxAge: 1000*60*60*24,
            httpOnly:true
        });

        res.cookie('refreshToken',refreshToken,{
            maxAge: 1000*60*60*24,
            httpOnly:true
        });

       } catch (e) {
        return next(e);
       }


        //send response
        const user = await User.findOne({_id:id});

        res.status(200).json({user:user,auth:true});



    }
  
}

module.exports = authController;