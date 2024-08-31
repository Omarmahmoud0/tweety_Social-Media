import { z } from "zod"

export const SignUpValidation = z.object({
    name: z.string().min(2, {message: "Too short"}),
    username: z.string().min(2, {message:'Too short'}),
    email: z.string().email(),
    password: z.string().min(8, {message: "Password must be at least 8 characters."})
})


export const SignInValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8, {message: "Password must be at least 8 characters."})
})


export const PostValidation = z.object({
    caption: z.string().min(10).max(2200),
    file: z.custom<File[]>(),
    location: z.string().min(2).max(500),
    tags: z.string()
})

export const UpdateProfileValidation = z.object({
    name: z.string().min(5),
    username: z.string().min(3),
    email: z.string().email(),
    bio: z.string(),
    file: z.custom<File[]>()
})

export const ChangePasswordValidation = z.object({
    newPassword: z.string().min(8),
    oldPassword: z.string().min(8)
})

export const PassRecovery = z.object({
    email: z.string(),
})
export const ResetPass = z.object({
    password: z.string().min(8)
})