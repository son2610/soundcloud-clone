"use client";

import { useWavesurfer } from "@/utils/customHook";
// import WaveTrack from "@/components/track/wave.track";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WaveSurferOptions } from "wavesurfer.js";
import "./wave.scss";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { Tooltip, Zoom } from "@mui/material";
import { sendRequest } from "@/utils/api";

const WaveTrack = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [timeState, setTimeState] = useState<string>("0:00");
    const [durationState, setDurationState] = useState<string>("0:00");
    const hoverRef = useRef<HTMLDivElement>(null);
    // search parameters dynaic
    const searchParams = useSearchParams();
    const fileName = searchParams.get("audio");
    //
    const [isPlaying, setIsPlaying] = useState(false);

    //to get id from url
    const id = searchParams.get("id");

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
    const [trackInfo, setTrackInfo] = useState<ITrackTop | null>(null);

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

    useEffect(() => {
        const fetchData = async () => {
            const res = await sendRequest<IBackendRes<ITrackTop>>({
                url: `http://localhost:8000/api/v1/tracks/${id}`,
                method: "GET",
            });
            if (res && res.data) {
                setTrackInfo(res.data);
            }
        };
        fetchData();
    }, [id]);

    //comment
    const arrComments = [
        {
            id: 1,
            avatar: "http://localhost:8000/images/chill1.png",
            moment: 10,
            user: "username 1",
            content: "just a comment1",
        },
        {
            id: 2,
            avatar: "http://localhost:8000/images/chill1.png",
            moment: 30,
            user: "username 2",
            content: "just a comment3",
        },
        {
            id: 3,
            avatar: "http://localhost:8000/images/chill1.png",
            moment: 50,
            user: "username 3",
            content: "just a comment3",
        },
    ];
    const handleCaclLeft = (moment: number): string => {
        const durationSong = 199;
        const leftPercent = (moment / durationSong) * 100;
        return `${leftPercent}%`;
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
                                    onClick={onPlayClick}
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
                            <h2>{`${trackInfo?.title}`}</h2>
                            <p>{`${trackInfo?.description}`}</p>
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
                                {arrComments.map((item) => {
                                    return (
                                        <Tooltip
                                            title={item.content}
                                            arrow
                                            TransitionComponent={Zoom}
                                            leaveDelay={200}
                                            key={item.id}
                                        >
                                            <img
                                                key={item.id}
                                                src={item.avatar}
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
                    <img
                        src="http://localhost:3000/image/default.png"
                        width={250}
                        height={250}
                    />
                </div>
            </div>
        </>
    );
};

export default WaveTrack;
