"use client";

import { useWavesurfer } from "@/utils/customHook";
// import WaveTrack from "@/components/track/wave.track";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WaveSurferOptions } from "wavesurfer.js";
import "./wave.scss";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { Tooltip, Zoom } from "@mui/material";
import { useTrackContext } from "@/app/lib/track.wrapper";
import { fetchDefaultImage, sendRequest } from "@/utils/api";
import CommentTrack from "./comment.track";
import LikeTrack from "./steps/like.track";

interface IProps {
    track: ITrackTop | null;
    arrComment: IComment[];
}
const WaveTrack = (props: IProps) => {
    const firstViewRef = useRef(true);
    const { track, arrComment } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const [timeState, setTimeState] = useState<string>("0:00");
    const [durationState, setDurationState] = useState<string>("0:00");
    const hoverRef = useRef<HTMLDivElement>(null);
    // search parameters dynaic
    const searchParams = useSearchParams();
    const fileName = searchParams.get("audio");
    //
    const [isPlaying, setIsPlaying] = useState(false);

    //
    const { currentTrack, setCurrentTrack } =
        useTrackContext() as ITrackContext;

    //
    const router = useRouter();

    // //to get id from url
    // const id = searchParams.get("id");

    const optionMemo = useMemo((): Omit<WaveSurferOptions, "container"> => {
        let gradient, progressGradient;
        if (typeof window !== "undefined") {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d")!;

            // Define the waveform gradient
            gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
            gradient.addColorStop(0, "#656666"); // Top color
            gradient.addColorStop(
                (canvas.height * 0.7) / canvas.height,
                "#656666"
            ); // Top color
            gradient.addColorStop(
                (canvas.height * 0.7 + 1) / canvas.height,
                "#ffffff"
            ); // White line
            gradient.addColorStop(
                (canvas.height * 0.7 + 2) / canvas.height,
                "#ffffff"
            ); // White line
            gradient.addColorStop(
                (canvas.height * 0.7 + 3) / canvas.height,
                "#B1B1B1"
            ); // Bottom color
            gradient.addColorStop(1, "#B1B1B1"); // Bottom color

            // Define the progress gradient
            progressGradient = ctx.createLinearGradient(
                0,
                0,
                0,
                canvas.height * 1.35
            );
            progressGradient.addColorStop(0, "#EE772F"); // Top color
            progressGradient.addColorStop(
                (canvas.height * 0.7) / canvas.height,
                "#FF4000"
            ); // Top color
            progressGradient.addColorStop(
                (canvas.height * 0.7 + 1) / canvas.height,
                "#ffffff"
            ); // White line
            progressGradient.addColorStop(
                (canvas.height * 0.7 + 2) / canvas.height,
                "#ffffff"
            ); // White line
            progressGradient.addColorStop(
                (canvas.height * 0.7 + 3) / canvas.height,
                "#F6B094"
            ); // Bottom color
            progressGradient.addColorStop(1, "#F6B094"); // Bottom color
        }
        return {
            waveColor: gradient,
            progressColor: progressGradient,
            url: `/api?audio=${fileName}`, //remote url
            height: 100,
            barWidth: 3,
        };
    }, []);

    const wavesurfer = useWavesurfer(containerRef, optionMemo);
    // On play button click
    const onPlayClick = useCallback(() => {
        if (wavesurfer) {
            wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
            console.log("Check loop play click");
        }
    }, [wavesurfer]);

    const hover = hoverRef.current!;
    const waveform = containerRef.current!;

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secondsRemainder = Math.round(seconds) % 60;
        const paddedSeconds = `0${secondsRemainder}`.slice(-2);

        return `${minutes}:${paddedSeconds}`;
    };

    //save infor track data when fetch data
    // const [track, settrack] = useState<ITrackTop | null>(null);

    useEffect(() => {
        if (!wavesurfer) return;
        setIsPlaying(false);

        waveform.addEventListener(
            "pointermove",
            (e) => (hover.style.width = `${e.offsetX}px`)
        );

        const subscriptions = [
            wavesurfer.on("play", () => setIsPlaying(true)),
            wavesurfer.on("pause", () => setIsPlaying(false)),

            // timeline handlers
            wavesurfer.on("decode", (duration) => {
                setDurationState(formatTime(duration));
            }),
            wavesurfer.on("timeupdate", (duration) => {
                setTimeState(formatTime(duration));
            }),
            //handle play/pause when click
            wavesurfer.on("interaction", () => {
                wavesurfer.playPause();
            }),
        ];

        return () => {
            subscriptions.forEach((unsub) => unsub());
        };
    }, [wavesurfer]);

    // const arrComments = [
    //     {
    //         _id: 1,
    //         avatar: "http://localhost:8000/images/chill1.png",
    //         moment: 10,
    //         user: "username 1",
    //         content: "just a comment1",
    //     },
    //     {
    //         _id: 2,
    //         avatar: "http://localhost:8000/images/chill1.png",
    //         moment: 30,
    //         user: "username 2",
    //         content: "just a comment3",
    //     },
    //     {
    //         _id: 3,
    //         avatar: "http://localhost:8000/images/chill1.png",
    //         moment: 50,
    //         user: "username 3",
    //         content: "just a comment3",
    //     },
    // ];

    const handleCaclLeft = (moment: number): string => {
        const durationSong = wavesurfer?.getDuration() ?? 0;
        const leftPercent = (moment / durationSong) * 100;
        return `${leftPercent}%`;
    };

    useEffect(() => {
        if (currentTrack.isPlaying && wavesurfer) wavesurfer.pause();
    }, [currentTrack]);

    useEffect(() => {
        if (track?._id && !currentTrack._id)
            setCurrentTrack({ ...track, isPlaying: false });
    }, [track]);

    const handleIncreaseView = async () => {
        if (firstViewRef.current) {
            console.log("Next co chay vao day khong the");
            await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/tracks/increase-view`,
                method: "POST",
                body: {
                    trackId: track?._id,
                },
            });

            await sendRequest<IBackendRes<any>>({
                url: `/api/revalidate`,
                method: "POST",
                queryParams: {
                    tag: "track-by-id",
                },
            });
            router.refresh();
            firstViewRef.current = false;
        }
    };

    //
    return (
        <>
            <div className="container">
                <div className="infomationSong">
                    <div className="infomationSong__header">
                        <div className="infomationSong__header--btn">
                            <Box sx={{ "& > :not(style)": { m: 1 } }}>
                                <Fab
                                    sx={{
                                        backgroundColor: "#FF3300",
                                        color: "#fff",
                                        "&.MuiButtonBase-root:hover": {
                                            bgcolor: "#FFA480",
                                        },
                                    }}
                                    aria-label="Play/Pause"
                                    onClick={() => {
                                        onPlayClick();
                                        handleIncreaseView();
                                        if (track && wavesurfer) {
                                            setCurrentTrack({
                                                ...currentTrack,
                                                isPlaying: false,
                                            });
                                        }
                                    }}
                                >
                                    {!isPlaying ? (
                                        <PlayArrowIcon fontSize="large" />
                                    ) : (
                                        <PauseIcon fontSize="large" />
                                    )}
                                </Fab>
                            </Box>
                        </div>
                        <div className="infomationSong__header--text">
                            <h2>{`${track?.title}`}</h2>
                            <p>{`${track?.description}`}</p>
                        </div>
                    </div>
                    <div className="infomationSong__wake">
                        <div ref={containerRef} id="waveform-container">
                            <div className="time">{timeState}</div>
                            <div className="duration">{durationState}</div>
                            {/* <div id="mydiv"> */}
                            <div ref={hoverRef} className="hover-wave"></div>
                            {/* </div> */}
                            <div className="overlay"></div>
                            <div className="comments">
                                {arrComment.map((item) => {
                                    return (
                                        <Tooltip
                                            title={item.content}
                                            arrow
                                            TransitionComponent={Zoom}
                                            leaveDelay={200}
                                            key={item._id}
                                        >
                                            <img
                                                key={item._id}
                                                src={fetchDefaultImage(
                                                    item?.user?.type
                                                )}
                                                style={{
                                                    left: handleCaclLeft(
                                                        item.moment
                                                    ),
                                                }}
                                                onPointerMove={(e) => {
                                                    const hover =
                                                        hoverRef.current!;
                                                    console.log("check e: ", e);
                                                    hover.style.width =
                                                        handleCaclLeft(
                                                            item.moment
                                                        );
                                                }}
                                            />
                                        </Tooltip>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="imageSong">
                    {track?.imgUrl ? (
                        <img
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}`}
                            width={250}
                            height={250}
                        />
                    ) : (
                        <div
                            style={{
                                background: "#ccc",
                                width: "250px",
                                height: "250x",
                            }}
                        ></div>
                    )}
                </div>
            </div>
            <div style={{ marginTop: "50px" }}>
                <LikeTrack track={track} />
                <CommentTrack
                    arrComment={arrComment}
                    track={track}
                    wavesurfer={wavesurfer}
                />
            </div>
        </>
    );
};

export default WaveTrack;
