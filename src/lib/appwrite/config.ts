import { Client, Account, Databases, Storage, Avatars } from "appwrite";


export const appwriteConfig = {
    projectId: import.meta.env.VITE_APPWRITE_PROJECTID,
    url: import.meta.env.VITE_APPWRITE_URL,
    storageId: import.meta.env.VITE_APPWRITE_STORAGEID,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASEID,
    userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTIONID,
    savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTIONID,
    postCollectionId: import.meta.env.VITE_APPWRITE_POST_COLLECTIONID
}


export const client = new Client();

client.setProject(appwriteConfig.projectId);
client.setEndpoint(appwriteConfig.url);

// client.setEndpoint('https://cloud.appwrite.io/v1').setProject(appwriteConfig.projectId)


export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);