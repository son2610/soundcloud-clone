import { Chip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useSession } from "next-auth/react";
import { memo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sendRequest } from "@/utils/api";

interface IProps {
    track: ITrackTop | null;
}

function LikeTrack(props: IProps) {
    const { track } = props;
    const { data: session } = useSession();
    const router = useRouter();

    const [trackLikes, setTrackLikes] = useState<ITrackLike[] | null>(null);

    const fetchData = async () => {
        if (session?.access_token) {
            const resLike = await sendRequest<
                IBackendRes<IModelPaginate<ITrackLike>>
            >({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/likes`,
                method: "GET",
                queryParams: {
                    current: 1,
                    pageSize: 100,
                },
                headers: {
                    Authorization: `Bearer ${session?.access_token}`,
                },
            });
            if (resLike.data?.result) {
                setTrackLikes(resLike.data.result);
            }
            console.log("check resLike", resLike?.data?.result);
        }
    };
    useEffect(() => {
        fetchData();
        // router.refresh();
    }, [session]);

    const handleLikeTrack = async () => {
        await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/likes`,
            method: "POST",
            body: {
                track: track?._id,
                quantity: trackLikes?.some((t) => t._id === track?._id)
                    ? -1
                    : 1,
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            },
        });

        fetchData();
        router.refresh();
    };

    console.log("check trackLike useState", trackLikes);
    return (
        <div
            style={{
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <div>
                {/* like */}
                <Chip
                    label="Like"
                    variant="outlined"
                    onClick={() => handleLikeTrack()}
                    icon={<FavoriteIcon />}
                    color={
                        trackLikes?.some((t) => {
                            t._id === track?._id;
                            console.log("some t.id", t._id);
                            console.log("some track.id", track?._id);
                        })
                            ? "error"
                            : "info"
                    }
                />
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                {/* amount */}
                <span style={{ display: "flex", alignItems: "center" }}>
                    {<PlayArrowIcon />} {track?.countPlay}
                </span>
                <span style={{ display: "flex", alignItems: "center" }}>
                    {<FavoriteIcon />} {track?.countLike}
                </span>
            </div>
        </div>
    );
}

export default memo(LikeTrack);
