/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose,{Schema,Document, mongo} from "mongoose";

export interface Message extends Document{
    content:string;
    createdAt:Date
}

const MessageSchema : Schema<Message> =  new Schema({
    content : {
        type : String,
        required:true
    },
    createdAt :{
        type: Date,
        required:true,
        default : Date.now()
    }
})

export interface User extends Document{
    username:string;
    email : string;
    password : string;
    verifyCode : string;
    verifyCodeExpiry : Date;
    isVerified:boolean;
    isAcceptingMessages : boolean;
    messages : Message[]
}

const UserSchema: Schema<User> = new Schema ({
    username :{
        type :  String,
        required : [true,"Username is Required"],
        trim:true,
        unique:true
    },
    email :{
        type :  String,
        required : [true,"Email is Required"],
        unique:true,
        match : [/.+\@.+\..+/,"Please use a valid email address"]
    },
    password :{
        type : String,
        required:[true,"Password is required"],
    },
    verifyCode :{
        type : String,
        required:[true,"verify Code is required"],
    },
    verifyCodeExpiry :{
        type : Date,
        required:[true,"verify Code Expiry is required"],
    },
    isVerified :{
        type : Boolean,
        default:false
    },
    isAcceptingMessages:{
        type:Boolean,
        default:true
    },
    messages : [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)

export default UserModel;


