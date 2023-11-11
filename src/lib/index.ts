import * as z from "zod";

export const signUpValidation = z.object({
    name: z.string().min(2, {message: "name too short"}),
    username: z.string().min(4, { message: "Username too short" }),
    email: z.string().email(),
    password: z.string().min(6, {message: "Password must be atleast 8 characters"})
})

export const signInValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8, {message: "Password too short!"})
})


export const PostValidation = z.object({
    caption: z.string().min(2, { message: 'Caption should at least be 5 characters' }).max(2200, { message: 'Caption longer than 2200 characters' }),
    file: z.custom<File[]>(),
    location: z.string().min(2).max(100),
    tags: z.string()
})