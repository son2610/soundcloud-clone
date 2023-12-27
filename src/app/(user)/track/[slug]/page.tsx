import WaveTrack from "@/components/track/wave.track";
import { sendRequest } from "@/utils/api";
import { Container } from "@mui/material";
import { notFound } from "next/navigation";
// import { useSearchParams } from "next/navigation";
// import { useRef } from "react";

const DetailTrack = async (props: any) => {
    const { params } = props;
    // console.log("check params from slug", params);
    // search parameters dynaic
    // const searchParams = useSearchParams();
    // const search = searchParams.get("audio");
    //

    // const myRef = useRef<HTMLDivElement>(null);

    const resTrack = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/tracks/${params.slug}`,
        method: "GET",
        nextOption: {
            // caches: "no-store"
            next: { tags: ["track-by-id"] },
        },
    });

    const resComment = await sendRequest<IBackendRes<IModelPaginate<IComment>>>(
        {
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/tracks/comments`,
            method: "POST",
            queryParams: {
                current: 1,
                pageSize: 10,
                trackId: params.slug,
                sort: "-createAt",
            },
        }
    );
    if (!resTrack.data) {
        notFound();
    }
    return (
        <div>
            DetailTrack
            <Container>
                <WaveTrack
                    track={resTrack?.data ?? null}
                    arrComment={resComment.data?.result!}
                />
            </Container>
        </div>
    );
};

export default DetailTrack;
