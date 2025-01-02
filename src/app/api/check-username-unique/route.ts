
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import {z} from 'zod'

const UsernameQuerySchema = z.object({
    username : usernameValidation
})

export async function GET(request :Request){

    await dbConnect()

    try {
        const {searchParams} = new URL(request.url)

        const queryParams = {
            username : searchParams.get('username')
        }

        const result = UsernameQuerySchema.safeParse(queryParams)
        console.log(result)

        if(!result.success){
            const usernameError = result.error.format().username?._errors || []

            return Response.json({
                success:false,
                message : usernameError.length > 0 ? usernameError.join(",") : "Invalid Username"
            },{status:400})
        }

        const {username} = result.data

        const existingUser = await UserModel.findOne({username,isVerified:true})

        if(existingUser){
            return Response.json({
                success:false,
                message:"Username is already Taken"
            },{status:400})
        }

        return Response.json({
            success:true,
            message:"Username is available"
        },{status:200})

    } catch (error) {
        console.error("Error in check-username-validation GET",error)
        return Response.json(
            {
                success:false,
                message:"Error while validating username"
            },
            {status:500}
        )
    }
}

