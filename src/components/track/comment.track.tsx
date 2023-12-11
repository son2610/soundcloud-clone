import { fetchDefaultImage, sendRequest } from "@/utils/api";
import { Box, TextField, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import React, { memo, useState } from "react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import WaveSurfer from "wavesurfer.js";
import { useHasMounted } from "@/utils/customHook";

dayjs.extend(relativeTime);

interface IProps {
    track: ITrackTop | null;
    arrComment: IComment[];
    wavesurfer: WaveSurfer | null;
}

const CommentTrack = (props: IProps) => {
    const router = useRouter();
    const { data: session } = useSession();
    const { track, arrComment, wavesurfer } = props;
    const [yourComment, setYourComment] = useState("");
    const hasMounted = useHasMounted();

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secondsRemainder = Math.round(seconds) % 60;
        const paddedSeconds = `0${secondsRemainder}`.slice(-2);

        return `${minutes}:${paddedSeconds}`;
    };

    const handleSubmit = async () => {
        const resComment = await sendRequest<
            IBackendRes<IModelPaginate<IComment>>
        >({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/comments`,
            method: "POST",
            body: {
                content: yourComment,
                moment: Math.round(
                    Math.round(wavesurfer?.getCurrentTime() ?? 10)
                ),
                track: track?._id,
                sort: "-createAt",
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            },
        });
        if (resComment.data) {
            // alert("susscess");
            setYourComment("");
            router.refresh();
        }
    };
    // };
    // console.log(arrComment[0]);
    // console.log("chek duration submit", wavesurfer?.getCurrentTime());
    const hanldJumpTrack = (moment: number) => {
        if (wavesurfer) {
            const duration = wavesurfer.getDuration();
            wavesurfer.seekTo(moment / duration);
            wavesurfer.play();
        }
    };
    console.log("check loop comment component");
    return (
        <>
            <TextField
                fullWidth
                label="Comment here"
                id="fullWidth"
                value={yourComment}
                onChange={(e) => setYourComment(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit();
                }}
            />
            <Box
                sx={{ display: "flex", border: "1px solid gray" }}
                // id="wrap"
            >
                <Box
                    width={"20%}"}
                    // id="avatar"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                        border: "1px solid red",
                    }}
                >
                    <img
                        alt="Avatar"
                        // @ts-ignore
                        src={fetchDefaultImage(
                            track?.uploader?.type || "GITHUB"
                        )}
                        width={"150px"}
                    />
                    <Typography>
                        {track?.uploader?.email || "Anonymous"}
                    </Typography>
                </Box>
                <Box
                    width={"80%"}
                    // id="wrapComment"
                    // sx={{
                    //     display: "flex",
                    //     justifyContent: "space-between",
                    //     border: "1px solid black",
                    //     flexDirection: "column",
                    // }}
                >
                    {arrComment.map((itemComment) => {
                        return (
                            <Box
                                // width={"100%"}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    border: "1px solid red",
                                    flexDirection: "row",
                                }}
                            >
                                <Box
                                    id="desComment"
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: "20px",
                                        width: "100%",
                                        alignItems: "center",
                                    }}
                                >
                                    <img
                                        alt="Avatar"
                                        // @ts-ignore
                                        src={fetchDefaultImage(
                                            itemComment?.user?.type
                                        )}
                                        width={"30px"}
                                        height={"30px"}
                                    />
                                    <Box id="wrapContent">
                                        <Typography>
                                            {itemComment?.user?.email} at{" "}
                                            <span
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => {
                                                    hanldJumpTrack(
                                                        itemComment.moment
                                                    );
                                                }}
                                            >
                                                {formatTime(itemComment.moment)}
                                            </span>
                                        </Typography>
                                        <Typography>
                                            {itemComment?.content}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box id="caclTimer" sx={{ display: "flex" }}>
                                    {hasMounted &&
                                        dayjs(itemComment?.createdAt).fromNow()}
                                </Box>
                            </Box>

                            // </Box>
                        );
                    })}
                </Box>
            </Box>
        </>
    );
};

export default memo(CommentTrack);
