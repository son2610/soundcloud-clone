// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { authOptions } from "@/app/(user)/api/auth/[...nextauth]/route";
import AuthSignIn from "@/components/auth/auth.signin";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function SignInPage() {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect("/");
    }
    return <AuthSignIn />;
}

export default SignInPage;
