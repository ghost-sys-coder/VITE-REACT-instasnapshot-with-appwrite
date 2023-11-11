      import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useToast } from "../ui/use-toast"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormMessage, FormItem, FormLabel } from "@/components/ui/form"
import { Textarea } from "../ui/textarea"
import { Input } from "../ui/input"
import { FileUpload } from "../shared"
import { PostValidation } from "@/lib"
import { Models } from "appwrite"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations"
import { useAuthContext } from "@/context/AuthContext"
import { toastError } from "@/constants"

type PostFormProps = {
    post?: Models.Document,
    action: 'Create' | 'Update'
}

const PostForm = ({ post, action }: PostFormProps) => {

    const navigate = useNavigate();
    const { mutateAsync: createPost, isPending: isCreatingPost } = useCreatePost();
    const { mutateAsync: updatePost, isPending: isUpdatingPost } = useUpdatePost();
    const { user } = useAuthContext();
    const { toast } = useToast();

    // 1. Define your form.
    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            caption: post ? post?.caption : '',
            file: [],
            location: post ? post?.location : '',
            tags: post ? post.tags.join(",") : '',
        },
    })
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof PostValidation>) {
        /** Updating Post */
        if (post && action === "Update") {
            const updatedPost = await updatePost({
                ...values,
                postId: post.$id,
                imageId: post?.imageId,
                imageUrl: post?.imageUrl
            });

            if (!updatedPost) {
                toast({
                    title: 'Please try again!',
                    style: toastError
                })
            }

            return navigate(`/posts/${post.$id}`)
        }

        /** Creating New Post */
        const newPost = await createPost({
            ...values,
            userId: user.id
        });

        if (!newPost) {
            return toast({
                title: 'Please try again!',
                style: toastError
            })
        }

        navigate("/")
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
                <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Caption:</FormLabel>
                            <FormControl>
                                <Textarea className="shad-textarea custom-scrollbar" placeholder="cation..." {...field} />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Add Photos:</FormLabel>
                            <FormControl>
                                <FileUpload
                                    fieldChange={field.onChange}
                                    mediaUrl={post?.imageUrl}
                                />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Location:</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input" placeholder="location..." {...field} />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Add Tags (separated by comma ","):</FormLabel>
                            <FormControl>
                                <Input className="shad-input" placeholder="Art, Expression and learn.." {...field} />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />
                <div className="flex gap-4 items-center justify-end">
                    <Button
                        className="shad-button_dark_4"
                        type="submit"
                    >Cancel</Button>
                    <Button
                        className="shad-button_primary whitespace-nowrap"
                        type="submit"
                        disabled={isCreatingPost || isUpdatingPost}
                    >
                        {isCreatingPost || isUpdatingPost && "Loading..."}
                        {action} Post
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default PostForm