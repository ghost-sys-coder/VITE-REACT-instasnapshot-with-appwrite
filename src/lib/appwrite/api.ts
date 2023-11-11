import { ID, Query } from "appwrite";
import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteConfig, database, storage } from "./config";
import { avatars } from "./config";

export async function saveUserToDB(
    user: {
        accountID: string;
        email: string;
        name: string;
        imageUrl: URL;
        username?: string;
    }
) {
   try {
       const newUser = await database.createDocument(
           appwriteConfig.databaseId,
           appwriteConfig.userCollectionId,
           ID.unique(),
           user
       );
       console.log('user saved', newUser)
       return newUser;
   } catch (error) {
       console.log(error);
   }
}

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        );
        if (!newAccount) throw Error;
        
        const { $id, name, email } = newAccount;

        const avatarUrl = avatars.getImage(user.name);

        const newUser = await saveUserToDB({
            accountID: $id,
            name: name,
            email: email,
            username: user.username,
            imageUrl: avatarUrl
        })

        console.log('user saved!', newUser)
        return newUser;
        
    } catch (error) {
        console.log(error);
        return error;
    }
}


export async function signInAccount(user: { email: string; password: string; }){
    try {
        const session = await account.createEmailSession(user.email, user.password);
        console.log('session created!', session);
        return session;
    } catch (error) {
        console.log(error);
    }
}


export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;
        
        const currentUser = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountID', currentAccount.$id)]
        )
        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current");
        return session;
    } catch (error) {
        console.log(error);
    }
}

/**
 * ! Post Image Uploader
 */
export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );
        return uploadedFile;
    } catch (error) {
        console.log(error)
    }
}
/**
 * ! Post Image Preview
 */
export async function getFilePreview(fileId: string) {
    try {
        const fileUrl = await storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            "top",
            100
        );
        if (!fileUrl) throw Error;
        return fileUrl;
    } catch (error) {
        console.log(error)
    }
}
/**
 * ! Delete Image File
 */
export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(
            appwriteConfig.storageId,
            fileId
        );
        return { status: 'file deleted!'}
    } catch (error) {
        console.log(error);
    }
}


/**
 * ! Create a new post
 */
export async function createPost(post: INewPost) {
    try {
        /** Upload file to appwrite storage */
        const uploadedFile = await uploadFile(post.file[0]);
        if (!uploadedFile) throw Error;

        /** Get file url */
        const fileUrl = await getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        /** Convert tags into array */
        const tags = post.tags?.replace(/ /g, "").split(',') || [];

        /** Create Post */
        const newPost = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags: tags
            }
        );

        if (!newPost) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        return newPost;
        
    } catch (error) {
        console.log(error)
    }
}

/**
 * ! Fetching Posts
 */
export async function getRecentPosts() {
    const posts = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(20)]
    );

    if (!posts) throw Error;

    return posts;
}

/** like a post */
export async function likePost(postId: string, likesArray: string[]) {
    try {
        const updatedPost = await database.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes: likesArray
            }
        );
        if (!updatedPost) throw Error;

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

/** save a post */
export async function savePost(postId: string, userId: string) {
    try {
        const savedPost = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId
            }
        );
        if (!savedPost) throw Error;
        return savedPost;
    } catch (error) {
        console.log(error);
    }
}

/** delete saved post */
export async function deleteSavedPost(savedRecordId: string) {
    try {
        const statusCode = await database.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedRecordId
        );
        if (!statusCode) throw Error;
        return {status: 'Record Deleted!'}
    } catch (error) {
        console.log(error);
    }
}

/** get post document */
export async function getPostById(postId: string) {
    try {
        const post = await database.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        );
        return post;
    } catch (error) {
        console.log(error);
    }
}

/** Edit and update Post */
export async function updatePost(post: IUpdatePost) {
    /** Check if there is a new image to upload */
    const hasFileToUpdate = post.file.length > 0;

    try {
        let image = {
            imageUrl: post.imageUrl,
            imageId: post.imageId
        }

        if (hasFileToUpdate) {
            /** Upload file to appwrite storage */
            const uploadedFile = await uploadFile(post.file[0]);
            if (!uploadedFile) throw Error;
    
            /** Get file url */
            const fileUrl = await getFilePreview(uploadedFile.$id);
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw Error;
            }
            
            image = {...image, imageId: uploadedFile.$id, imageUrl: fileUrl}
        }


        /** Convert tags into array */
        const tags = post.tags?.replace(/ /g, "").split(',') || [];

        /** Create Post */
        const updatedPost = await database.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            post.postId,
            {
                caption: post.caption,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                location: post.location,
                tags: tags
            }
        );

        if (!updatedPost) {
            await deleteFile(post.imageId);
            throw Error;
        }

        return updatedPost;
        
    } catch (error) {
        console.log(error)
    }
}

/** Delete Post */

export async function deletePost(postId: string, imageId: string) {
    if (!postId || !imageId) throw Error;

    try {
        await database.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        );
        return {status: 'Post Deleted!'}
    } catch (error) {
        console.log(error);
    }
}

/** Get infinite posts */
export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
    const queries: any[] = [Query.orderAsc('$updatedAt'), Query.limit(10)];
    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()))
    }

    try {
        const posts = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        );

        if (!posts) throw Error;

        return posts;
    } catch (error) {
        console.log(error);
    }
}

/** Search for Posts */
export async function searchPosts(searchItem: string) {
    try {
        const posts = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.search('caption', searchItem)]
        );

        if (!posts) throw Error;

        return posts;
    } catch (error) {
        console.log(error);
    }
}