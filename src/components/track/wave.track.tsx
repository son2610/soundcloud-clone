"use client";

import { useWavesurfer } from "@/utils/customHook";
// import WaveTrack from "@/components/track/wave.track";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WaveSurferOptions } from "wavesurfer.js";
import "./wave.scss";

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
                "#EB4926"
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
    useEffect(() => {
        if (!wavesurfer) return;
        setIsPlaying(false);

        //@ts-ignore
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
        ];

        return () => {
            subscriptions.forEach((unsub) => unsub());
        };
    }, [wavesurfer]);

    return (
        <>
            <div ref={containerRef} id="waveform-container">
                <div className="time">{timeState}</div>
                <div className="duration">{durationState}</div>
                <div id="mydiv">
                    <div ref={hoverRef} className="hover-wave"></div>
                </div>
                <div
                    className="overlay"
                    style={{
                        position: "absolute",
                        height: "30px",
                        width: "100%",
                        bottom: "0",
                        background: "#ccc",
                    }}
                ></div>
            </div>
            <button onClick={onPlayClick}>
                {isPlaying ? "Pause" : "Play"}
            </button>
        </>
    );
};

export default WaveTrack;
