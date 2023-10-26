"use client";
import { useHasMounted } from "@/utils/customHook";
import { AppBar, Container } from "@mui/material";
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
    return (
        <AppBar
            position="fixed"
            sx={{ top: "auto", bottom: 0, bgcolor: "#f2f2f2" }}
        >
            <Container
                sx={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
                <AudioPlayer
                    autoPlay={false}
                    src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
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
