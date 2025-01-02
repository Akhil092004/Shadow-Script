import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function DELETE(request: Request, { params }: { params: Record<string, string> }) {
    await dbConnect();

    const messageId = params.messageid;

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Unauthorized",
            }),
            { status: 401 }
        );
    }

    try {
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        );

        if (updatedResult.modifiedCount === 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Message not found or already deleted",
                }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Message deleted successfully",
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in delete-message route:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Internal Server Error",
            }),
            { status: 500 }
        );
    }
}
