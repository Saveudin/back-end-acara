import { Request, Response } from 'express';
import { encrypt } from "../utils/encryption";
import {generateToken} from "../utils/jwt"
import * as Yup from 'yup';

import UserModel from '../models/user.model';
import { IReqUser } from '../middlewares/auth.middleware';

type TRegister = {
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

type TLogin = {
    identifier: string;
    password: string;
}

const registerValidateSchema = Yup.object({
    fullName: Yup.string().required(),
    username: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().required(),
    confirmPassword: Yup.string().required().oneOf([Yup.ref('password'), ""], 'Password must match')
})

export default {
    async register(req : Request, res: Response){
        const { fullName, username, email, password, confirmPassword } = req.body as unknown as TRegister;

        
        try{

            await registerValidateSchema.validate({ fullName, username, email, password, confirmPassword });

            const result = await UserModel.create({ fullName, username, email, password });

            res.status(200).json({
                message: "Register success",
                data: result
            })

        }catch (error){

            const err = error as unknown as Error;

            res.status(400).json({
                message: err.message,
                data: null

            })
        };
    },

    async login(req : Request, res: Response){
        
        const { identifier, password } = req.body as unknown as TLogin;
        

        try {
            /**
             #swagger.requestBody = {
             required: true,
             schema: {$ref: "#/components/schemas/LoginRequest"}
             }
             */

            //ambil data user berdasarkan identifier -> email/username
            const userByIdentifier = await UserModel.findOne({
                $or: [
                    { email: identifier },
                    { username: identifier }
                ]
            });

            if(!userByIdentifier){
                return res.status(403).json({
                    message: "User not found",
                    data: null
                })
            }

            // cek password
            const validatePassword: boolean = encrypt(password) === userByIdentifier.password;

            if (!validatePassword) {
                return res.status(403).json({
                    message: "Password not match",
                    data: null
                })
            };

            const token = generateToken({
                id: userByIdentifier._id, 
                role: userByIdentifier.role
            })

            res.status(200).json({
                message: "Login success",
                data: token
            })
            
        } catch (error) {
            const err = error as unknown as Error;

            res.status(400).json({
                message: err.message,
                data: null

            })
        }
    },

    async me(req: IReqUser, res: Response){
        /**
         #swagger.security = [{
            "bearerAuth": []
         }]
         */
        try {
            const user = req.user;
            const result = await UserModel.findById(user?.id);

            res.status(200).json({
                message: "Success get user profile!",
                data: result
            })
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message: err.message,
                data: null
            })
        }
    }
}