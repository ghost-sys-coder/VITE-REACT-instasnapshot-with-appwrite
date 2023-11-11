import React, { useState, useEffect } from "react";
import { Models } from "appwrite"
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { useDeleteSavedPost, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import Loader from "./Loader";


type PostStatsProp = {
    post?: Models.Document;
    userId: string;
}
const PostStats = ({ post, userId }: PostStatsProp) => {
    const likesList = post?.likes.map((user: Models.Document) => user.$id);

    const [likes, setLikes] = useState(likesList);
    const [isSaved, setIsSaved] = useState(false);

    const { data: currentUser } = useGetCurrentUser();

    const { mutate: likePost } = useLikePost();
    const { mutate: savePost, isPending: isSavingPost } = useSavePost();
    const { mutate: deleteSavedPost, isPending: isDeletingPost } = useDeleteSavedPost();

    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation();

        let newLikes = [...likes];

        const hasLiked = newLikes.includes(userId);

        if (hasLiked) {
            newLikes = newLikes.filter((id) => id !== userId);
        } else {
            newLikes.push(userId)
        }

        setLikes(newLikes);
        likePost({postId: post?.$id, likesArray: newLikes})
    }

    const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post?.$id);

    useEffect(() => {
        setIsSaved(!!savedPostRecord)
    }, [currentUser])

    const handleSavedPost = (e: React.MouseEvent) => {
        e.stopPropagation();


        if (savedPostRecord) {
            setIsSaved(false);
            deleteSavedPost(savedPostRecord.$id);
        } else {
            savePost({ postId: post?.$id, userId });
            setIsSaved(true);
        }
    }

    return (
        <div className="flex justify-between items-center z-20">
            <div className="flex gap-2 mr-5">
                <img
                    src={checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
                    alt="like"
                    width={20}
                    height={20}
                    onClick={handleLikePost}
                    className="cursor-pointer"
                />
                <p className="small-medium lg:base-medium">{likes.length}</p>
            </div>
            <div className="flex gap-2 mr-5">
                {isSavingPost || isDeletingPost ? <Loader /> : (
                    <img
                    src={isSaved ? "/assets/icons/saved.svg": "/assets/icons/save.svg"}
                    alt="like"
                    width={20}
                    height={20}
                    onClick={handleSavedPost}
                    className="cursor-pointer"
                />
               )} 
            </div>
        </div>
    )
}

export default PostStats