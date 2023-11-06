import { sendRequest } from "@/utils/api";
import NextAuth, { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt/types";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

// component dùng để liên kết với các provider để xác thực người dùng, chú ý hàm export { handler as GET, handler as POST }-> phải có cái này mới dùng được
export const authOptions: AuthOptions = {
    // Configure one or more authentication providers
    secret: process.env.GITHUB_SECRET,
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "jsmith",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const res = await sendRequest<IBackendRes<JWT>>({
                    url: "http://localhost:8000/api/v1/auth/login",
                    method: "POST",
                    body: {
                        username: credentials?.username,
                        password: credentials?.password,
                    },
                });

                // Add logic here to look up the user from the credentials supplied

                if (res && res.data) {
                    // Any object returned will be saved in `user` property of the JWT
                    return res.data as any;
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null;

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            },
        }),

        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),

        // ...add more providers here
    ],

    // xử lý việc tạo ra jwt từ các thông tin mà provider cung cấp sau khi đăng nhập bằng provider
    callbacks: {
        //chúng ta cần định dạng lại data của phần token, bằng việc định dạng lại interface trong next-auth.d.ts
        async jwt({ token, account, profile, trigger, user }) {
            // Persist the OAuth access_token and or the user id to the token right after signin
            if (trigger === "signIn" && account?.provider !== "credentials") {
                const res = await sendRequest<IBackendRes<JWT>>({
                    url: "http://localhost:8000/api/v1/auth/social-media",
                    method: "POST",
                    body: {
                        type: account?.provider.toLocaleUpperCase(),
                        username: user.email,
                    },
                });

                if (res.data) {
                    console.log("check fetch data: ", res.data);
                    token.access_token = res.data.access_token;
                    token.refresh_token = res.data.refresh_token;
                    token.user = res.data.user;
                }
            }
            if (trigger === "signIn" && account?.provider === "credentials") {
                //local data
                // @ts-ignore
                token.access_token = user.access_token;
                // @ts-ignore
                token.refresh_token = user.refresh_token;
                // @ts-ignore
                token.user = user.user;
            }
            console.log("check token in jwt callback: ", token);
            return token;
        },

        //chúng ta cần định dạng lại data của phần session, bằng việc định dạng lại interface trong next-auth.d.ts
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token and user id from a provider.
            if (token) {
                session.access_token = token.access_token;
                session.refresh_token = token.refresh_token;
                session.user = token.user;
            }

            console.log("check session in session callback: ", session);
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
