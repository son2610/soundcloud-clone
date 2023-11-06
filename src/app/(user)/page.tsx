import MainSlider from "@/theme/main/main.slider";
import { sendRequest } from "@/utils/api";
import { Container } from "@mui/material";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function HomePage() {
    //     const res = await fetch("http://localhost:8000/api/v1/tracks/top", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //             category: "CHILL",
    //             limit: 2,
    //         }),
    //     });
    //     console.log("Check res data", await res.json());

    //check session user loggin
    const session = await getServerSession(authOptions);
    console.log("check session", session);

    const chill = await sendRequest<IBackendRes<ITrackTop[]>>({
        url: "http://localhost:8000/api/v1/tracks/top",
        method: "POST",
        body: { category: "CHILL", limit: 10 },
    });

    const workOut = await sendRequest<IBackendRes<ITrackTop[]>>({
        url: "http://localhost:8000/api/v1/tracks/top",
        method: "POST",
        body: { category: "WORKOUT", limit: 10 },
    });

    const party = await sendRequest<IBackendRes<ITrackTop[]>>({
        url: "http://localhost:8000/api/v1/tracks/top",
        method: "POST",
        body: { category: "PARTY", limit: 10 },
    });

    return (
        <Container>
            <MainSlider dataProps={chill?.data ?? []} titleProp="Top Chill" />
            <MainSlider
                dataProps={workOut?.data ?? []}
                titleProp="Top WorkOut"
            />
            <MainSlider dataProps={party?.data ?? []} titleProp="Top Party" />
        </Container>
    );
}
