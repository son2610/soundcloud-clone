"use client";

import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { TrackContext } from "@/app/lib/track.wrapper";
import PauseIcon from "@mui/icons-material/Pause";

export default function ProfileTrackElement(props: any) {
    const theme = useTheme();
    const { data } = props;
    const { currentTrack, setCurrentTrack } = React.useContext(
        TrackContext
    ) as ITrackContext;

    //test
    // const [toggle, setToggle] = React.useState(false);

    return (
        <Card sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                    <Typography component="div" variant="h5">
                        {data.title}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        component="div"
                    >
                        {data.description}
                    </Typography>
                </CardContent>
                <Box
                    sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}
                >
                    <IconButton aria-label="previous">
                        {theme.direction === "rtl" ? (
                            <SkipNextIcon />
                        ) : (
                            <SkipPreviousIcon />
                        )}
                    </IconButton>
                    {/* <IconButton
                        aria-label="play/pause"
                        onClick={() => {
                            setCurrentTrack({ ...data, isPlaying: toggle });
                            setToggle(!toggle);
                        }}
                    > */}
                    {
                        // play button
                        (data._id !== currentTrack._id ||
                            (data._id === currentTrack._id &&
                                currentTrack.isPlaying === false)) && (
                            <IconButton
                                aria-label="play/pause"
                                onClick={() => {
                                    setCurrentTrack({
                                        ...data,
                                        isPlaying: true,
                                    });
                                    // setToggle(!toggle);
                                }}
                            >
                                <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                            </IconButton>
                        )
                    }
                    {
                        /* pause button */
                        data._id === currentTrack._id &&
                            currentTrack.isPlaying === true && (
                                <IconButton
                                    aria-label="play/pause"
                                    onClick={() => {
                                        setCurrentTrack({
                                            ...data,
                                            isPlaying: false,
                                        });
                                        // setToggle(!toggle);
                                    }}
                                >
                                    <PauseIcon sx={{ height: 38, width: 38 }} />
                                </IconButton>
                            )
                    }
                    {/* {!currentTrack.isPlaying ? (
                            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                        ) : (
                            <PauseIcon sx={{ height: 38, width: 38 }} />
                        )} */}
                    {/* <PlayArrowIcon sx={{ height: 38, width: 38 }} /> */}
                    {/* </IconButton> */}
                    <IconButton aria-label="next">
                        {theme.direction === "rtl" ? (
                            <SkipPreviousIcon />
                        ) : (
                            <SkipNextIcon />
                        )}
                    </IconButton>
                </Box>
            </Box>
            <CardMedia
                component="img"
                sx={{ width: "200px", height: "200px" }}
                image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${data.imgUrl}`}
                alt="Live from space album cover"
            />
        </Card>
    );
}
