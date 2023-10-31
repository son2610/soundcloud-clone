"use client";
import WaveTrack from "@/components/track/wave.track";
import { Container } from "@mui/material";
// import { useSearchParams } from "next/navigation";
// import { useRef } from "react";

function DetailTrack(props: any) {
    const { params } = props;
    // console.log("check params from slug", params);
    // search parameters dynaic
    // const searchParams = useSearchParams();
    // const search = searchParams.get("audio");
    //

    // const myRef = useRef<HTMLDivElement>(null);

    return (
        <div>
            DetailTrack
            <Container>
                <WaveTrack />
            </Container>
        </div>
    );
}

export default DetailTrack;
