/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import  bcrypt  from 'bcryptjs';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions : NextAuthOptions = {
    providers:[
        CredentialsProvider({

            id:"credentials",
            name : "Credentials",

            credentials: {
                email: { label: "Username", type: "text", placeholder: "Enter Your Email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any) : Promise<any>{
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })

                    if(!user){
                        throw new Error("User not found with this email")
                    }

                    if(!user.isVerified){
                        throw new Error("Please verify your account")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password)

                    if(!isPasswordCorrect){
                        throw new Error("Incorrect Password")
                    }
                    else{
                        return user
                    }


                } catch (err:any) {
                    throw new Error(err)
                }


            }
        })
    ]
}