import UserModel from "@/model/User";
import dbConnect  from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
// import { AuthOptions } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";


export async function POST(request : Request){
    await dbConnect();

    const session = await getServerSession(authOptions)

    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Unauthorized"
        },{status:401})
    }

    const userId = user._id;
    const {acceptMessages} = await request.json()


    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMesaage:acceptMessages},
            {new:true}
        )

        if(!updatedUser){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})
        }

        return Response.json({
            success:true,
            message:"Message accepting status updated successfully"
        },{status:200})


    } catch (error) {
        console.error("failed to update User message Status",error)
        return Response.json({
            success : true,
            message : "Failed to update user message status"
        },{status:500})
    }

}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request : Request){
    await dbConnect();

    const session = await getServerSession(authOptions)

    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success:false,
            message: "Unauthorized"
        },{status:401})
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId)
        if(!foundUser){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})
        }
        
        return Response.json({
            success:true,
            isAccecptingMessages:foundUser.isAcceptingMessages
        })
    } catch (error) {
        console.error("Failed to get user message status",error)
        return Response.json({
            success:false,
            message:"Failed to get user message status"
        },{status:500})
    }
}
