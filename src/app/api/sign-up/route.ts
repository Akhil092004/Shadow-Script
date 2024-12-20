/* eslint-disable @typescript-eslint/no-unused-vars */
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'

import { sendVerificationEmail } from "@/helpers/sendVerificationsEmail";



export async function POST(request :Request){
    await dbConnect()

    try {
        const {username,email,password} = await request.json()

        
    } catch (error) {
        console.error("Error registering User", error)

        return Response.json({
            success : false,
            message : 'Error registerign user'
        }, {status : 500})
    }
}