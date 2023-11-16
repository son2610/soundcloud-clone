"use client";
import { TrackContext } from "@/app/lib/track.wrapper";
import { useHasMounted } from "@/utils/customHook";
import { AppBar, Container } from "@mui/material";
import { useContext } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

// const StyledFab = styled(Fab)({
//     position: "absolute",
//     zIndex: 1,
//     top: -30,
//     left: 0,
//     right: 0,
//     margin: "0 auto",
// });

export default function FooterPlayer() {
    const hasMounted = useHasMounted();
    if (!hasMounted) return <></>;
    // ép kiểu useContext có định dạng là ItrackContext để gán cho 2 state global
    const { currentTrack, setCurrentTrack } = useContext(
        TrackContext
    ) as ITrackContext;
    console.log("check track context", currentTrack);
    return (
        <AppBar
            position="fixed"
            sx={{ top: "auto", bottom: 0, bgcolor: "#f2f2f2" }}
            // style={{ marginTop: "50px" }}
        >
            <Container
                sx={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                    ".rhap_main": {
                        gap: "30px",
                    },
                    ".rhap_main-controls-button": {
                        color: "#FF3300",
                    },
                    ".rhap_time,": {
                        color: ".#f50",
                    },
                    ".rhap_progress-indicator": {
                        backgroundColor: "#f50",
                    },
                    // ".rhap_main-controls-button": {
                    //     color: #ff5555,
                    // },
                }}
            >
                <AudioPlayer
                    layout="horizontal-reverse"
                    autoPlay={false}
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/hoidanit.mp3`}
                    onPlay={(e) => console.log("onPlay")}
                    style={{ boxShadow: "none" }}
                />
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: "10px",
                        minWidth: "100px",
                    }}
                >
                    <div style={{ color: "#ccc" }}> Artis</div>
                    <div style={{ color: "black" }}>Song</div>
                </div>
            </Container>
        </AppBar>
    );
}
