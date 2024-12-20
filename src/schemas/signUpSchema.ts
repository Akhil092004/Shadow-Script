import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(2,"username must be of atleast 2 characters")
    .max(20,"Must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special character")



export const signUpSchema = z.object({
    username : usernameValidation,
    email: z.string().email({message:"Invalid email address"}),
    password : z.string().min(6,{message:"Password must be of 6 characters"})
})

