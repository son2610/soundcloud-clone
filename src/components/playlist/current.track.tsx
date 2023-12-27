"use client";

import { Box, Typography } from "@mui/material";
import Link from "next/link";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import IconButton from "@mui/material/IconButton";
import { useTrackContext } from "@/app/lib/track.wrapper";

interface IProps {
    track: IShareTrack;
}
const CurrentTrack = (props: IProps) => {
    const { track } = props;

    const { currentTrack, setCurrentTrack } =
        useTrackContext() as ITrackContext;

    return (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
            }}
        >
            <Typography sx={{ py: 2 }}>
                <Link
                    style={{ textDecoration: "none", color: "unset" }}
                    href="#"
                >
                    {track.title}
                </Link>
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center" }}>
                {(track._id !== currentTrack._id ||
                    (track._id === currentTrack._id &&
                        currentTrack.isPlaying === false)) && (
                    <IconButton
                        aria-label="play/pause"
                        onClick={(e) => {
                            setCurrentTrack({ ...track, isPlaying: true });
                        }}
                    >
                        <PlayArrowIcon sx={{ height: 25, width: 25 }} />
                    </IconButton>
                )}

                {track._id === currentTrack._id &&
                    currentTrack.isPlaying === true && (
                        <IconButton
                            aria-label="play/pause"
                            onClick={(e) => {
                                setCurrentTrack({ ...track, isPlaying: false });
                            }}
                        >
                            <PauseIcon sx={{ height: 25, width: 25 }} />
                        </IconButton>
                    )}
            </Box>
        </Box>
    );
};

export default CurrentTrack;
