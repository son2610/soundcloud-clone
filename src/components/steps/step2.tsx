import * as React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import LinearProgress, {
    LinearProgressProps,
} from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { Button, Container, MenuItem } from "@mui/material";
import InputFileUpload from "./InputFileUpload";
import TextField from "@mui/material/TextField";

function LinearProgressWithLabel(
    props: LinearProgressProps & { value: number }
) {
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: "100%", mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

function LinearWithValueLabel() {
    const [progress, setProgress] = React.useState(10);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) =>
                prevProgress >= 100 ? 10 : prevProgress + 10
            );
        }, 800);
        return () => {
            clearInterval(timer);
        };
    }, []);
    return (
        <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel value={progress} />
        </Box>
    );
}

const Img = styled("img")({
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
});

const categoryTrack = [
    {
        value: "CHILL",
        label: "CHILL",
    },
    {
        value: "WORKOUT",
        label: "WORKOUT",
    },
    {
        value: "PARTY",
        label: "PARTY",
    },
];

export default function Step2() {
    return (
        <Paper
            sx={{
                p: 2,
                margin: "auto",
                // maxWidth: 500,

                flexGrow: 1,
                backgroundColor: (theme) =>
                    theme.palette.mode === "dark" ? "#1A2027" : "#fff",
            }}
        >
            <Grid container spacing={2}>
                <Grid container item>
                    <LinearWithValueLabel />
                </Grid>
                {/* image */}
                <Grid item md={4} xs={6}>
                    <Container>
                        <Img
                            alt="complex"
                            src="/static/images/grid/complex.jpg"
                            width={"200px"}
                            height={"200px"}
                        />
                        <InputFileUpload />
                    </Container>
                </Grid>
                {/* information */}
                <Grid item xs={6} md={8} container>
                    <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                            <TextField
                                fullWidth
                                label="Title"
                                id="fullWidth"
                                margin="dense"
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                id="fullWidth"
                                margin="dense"
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                id="outlined-select-currency"
                                select
                                label="Select"
                                defaultValue="CHILL"
                                helperText="Please select your category"
                            >
                                {categoryTrack.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Grid
                                item
                                container
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Button variant="outlined" sx={{ mt: "20px" }}>
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}
