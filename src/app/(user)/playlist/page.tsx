import { sendRequest } from "@/utils/api";
import { Box, Container, Divider, Typography } from "@mui/material";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import NewPlaylist from "@/components/playlist/new.playlist";
import AddPlaylistTrack from "@/components/playlist/add.playlist.track";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import CurrentTrack from "@/components/playlist/current.track";

async function playlistPage() {
    const session = await getServerSession(authOptions);
    const res1 = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/tracks`,
        method: "GET",
        queryParams: { current: 1, pageSize: 100 },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
    });

    const res = await sendRequest<IBackendRes<IModelPaginate<IPlaylist>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/playlists/by-user`,
        method: "POST",
        queryParams: { current: 1, pageSize: 100 },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ["playlist-by-user"] },
        },
    });

    const playlists = res?.data?.result ?? [];
    const tracks = res1?.data?.result ?? [];

    console.log("check playlists: ", playlists);
    console.log("check tracks: ", tracks);

    return (
        <Container
            sx={{
                display: "flex",
                justifyContent: "center",
                mt: "50px",
                backgroundColor: "lightblue",
                flexDirection: "column",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                {/* Header */}
                <Typography variant="h6">Danh sach phat</Typography>
                <Box
                    sx={{ display: "flex", flexDirection: "row", gap: "20px" }}
                >
                    <NewPlaylist />
                    <AddPlaylistTrack tracks={tracks} playlists={playlists} />
                </Box>
            </Box>
            <Divider sx={{ my: "20px" }} />
            <Box sx={{ display: "block" }}>
                {/* List playlist */}
                {playlists.map((playlist) => {
                    return (
                        <Accordion key={playlist._id}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>{playlist.title}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {playlist?.tracks?.map(
                                    (track, index: number) => {
                                        return (
                                            <div key={track._id}>
                                                {index === 0 && <Divider />}
                                                <CurrentTrack track={track} />
                                                <Divider />
                                            </div>
                                        );
                                    }
                                )}
                                {playlist?.tracks?.length === 0 && (
                                    <span>No data.</span>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </Box>
        </Container>
    );
}

export default playlistPage;
