import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

interface IUser {
    _id: string;
    username: string;
    email: string;
    isVerify: boolean;
    type: string;
    role: string;
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    // ghi đè lại interface JWT, để ta có thể thêm các thuộc tính phù hợp với project đối với JWT ở mục callback:jwt trong api[...nextauth]
    interface JWT {
        access_token: string;
        refresh_token: string;
        user: IUser;
    }
}

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: IUser;
        access_token: string;
        refresh_token: string;
    }
}
