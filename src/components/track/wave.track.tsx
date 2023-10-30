"use client";

import { useWavesurfer } from "@/utils/customHook";
// import WaveTrack from "@/components/track/wave.track";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const WaveTrack = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    // search parameters dynaic
    const searchParams = useSearchParams();
    const fileName = searchParams.get("audio");
    //
    const [isPlaying, setIsPlaying] = useState(false);

    const optionMemo = useMemo(() => {
        return {
            waveColor: "rgb(200, 0, 200)",
            progressColor: "rgb(100, 0, 100)",
            url: `/api?audio=${fileName}`, //remote url
        };
    }, []);
    const wavesurfer = useWavesurfer(containerRef, optionMemo);
    // On play button click
    const onPlayClick = useCallback(() => {
        if (wavesurfer) {
            wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
        }
    }, [wavesurfer]);

    useEffect(() => {
        if (!wavesurfer) return;
        setIsPlaying(false);

        const subscriptions = [
            wavesurfer.on("play", () => setIsPlaying(true)),
            wavesurfer.on("pause", () => setIsPlaying(false)),
        ];

        return () => {
            subscriptions.forEach((unsub) => unsub());
        };
    }, [wavesurfer]);

    return (
        <>
            <div ref={containerRef}></div>
            <button onClick={onPlayClick}>
                {isPlaying ? "Pause" : "Play"}
            </button>
        </>
    );
};

export default WaveTrack;
