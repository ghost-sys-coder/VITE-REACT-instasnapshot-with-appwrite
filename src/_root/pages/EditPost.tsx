import { useParams } from "react-router-dom";
import PostForm from "@/components/forms/PostForm";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";

const EditPost = () => {
    const { id } = useParams();

    const { data: post, isPending: isPostLoading } = useGetPostById(id || '');

    console.log({post})

    if (isPostLoading) {
        return <Loader />
    }

    return (
        <div className="flex flex-1">
            <div className="common-container">
                <div className="max-w-5xl flex-start gap-3 justify-start w-full">
                    <img
                        src="/public/assets/icons/add-post.svg"
                        alt="add post"
                        width={36}
                        height={36}
                    />
                    <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
                </div>
                <PostForm action="Update" post={post} />
            </div>
        </div>
    )
}

export default EditPost