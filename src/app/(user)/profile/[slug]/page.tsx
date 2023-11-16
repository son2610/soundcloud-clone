"use client";

import ProfileTrackElement from "@/components/header/profile.track";
import { sendRequest } from "@/utils/api";
import { styled } from "@mui/material/styles";
import { Box, Container } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Paper from "@mui/material/Paper";

async function profilePage({ params }: { params: { slug: string } }) {
    const trackOfUser = await sendRequest<
        IBackendRes<IModelPaginate<ITrackTop[]>>
    >({
        url: "http://localhost:8000/api/v1/tracks/users?current=1&pageSize=10",
        method: "POST",
        body: {
            id: params.slug,
        },
    });
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
    }));
    const data = trackOfUser.data?.result ?? [];
    console.log("check TrackOfUser", trackOfUser.data?.result);
    return (
        <Container sx={{ my: "4px" }}>
            <Grid container spacing={8}>
                {data.map((item: any, index: number) => {
                    return (
                        <Grid xs={12} md={6}>
                            <Item>
                                <ProfileTrackElement data={item} />
                            </Item>
                        </Grid>
                    );
                })}

                {/* <Grid xs={6}>
                    <Item>
                        <ProfileTrackElement data={data[0]} />
                    </Item>
                </Grid> */}
                {/* @ts-ignore */}
            </Grid>
        </Container>
    );
}

export default profilePage;
