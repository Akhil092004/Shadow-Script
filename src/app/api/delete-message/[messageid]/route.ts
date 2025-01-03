/* eslint-disable @typescript-eslint/no-explicit-any */
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";  // Import NextRequest and NextResponse

export async function DELETE(request: NextRequest, {params}: { params: any }) {
    await dbConnect();

    const messageId = params.messageid; 

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }

    try {
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        );

        if (updatedResult.modifiedCount === 0) {
            return NextResponse.json({
                success: false,
                message: "Message not found or already deleted"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Message deleted successfully"
        }, { status: 200 });
    } catch (error) {
        console.log("Error in delete-message route", error);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 });
    }
}
