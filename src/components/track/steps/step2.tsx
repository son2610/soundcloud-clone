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
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useToast } from "@/utils/toast";

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

function LinearWithValueLabel(props: IProps) {
    return (
        <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel value={props.trackUpload.percent} />
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
interface IProps {
    trackUpload: {
        fileName: string;
        percent: number;
        uploadedTrackName: string;
    };
    setValue: (value: number) => void;
}

interface INewTrackInfo {
    title: string;
    description: string;
    trackUrl: string;
    imgUrl: string;
    category: string;
}

export default function Step2(props: IProps) {
    const [infoTrack, setInfoTrack] = React.useState<INewTrackInfo>({
        title: "",
        description: "",
        trackUrl: "",
        imgUrl: "",
        category: "",
    });
    const { trackUpload, setValue } = props;
    React.useEffect(() => {
        if (trackUpload && trackUpload.uploadedTrackName) {
            setInfoTrack({
                ...infoTrack,
                trackUrl: trackUpload.uploadedTrackName,
            });
        }
    }, [trackUpload]);
    // console.log("check track upload step 2", trackUpload);
    const { data: session } = useSession();
    const toast = useToast();
    const handleSubmitForm = async () => {
        // console.log("check info track onchage: ", infoTrack);
        const res = await sendRequest<IBackendRes<ITrackTop[]>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/tracks`,
            method: "POST",
            headers: {
                Authorization: `Bearer ${session?.access_token}`, // notice the Bearer before your token
            },
            body: {
                title: infoTrack.title,
                description: infoTrack.description,
                trackUrl: infoTrack.trackUrl,
                imgUrl: infoTrack.imgUrl,
                category: infoTrack.category,
            },
        });
        if (res.data) {
            // alert("success " + res.data);
            toast.success(res.message);
            setValue(0);
        } else {
            // alert(res.message);
            toast.error(res.message);
        }
    };
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
                    <div>{trackUpload.fileName}</div>
                    <LinearWithValueLabel
                        trackUpload={trackUpload}
                        setValue={setValue}
                    />
                </Grid>
                {/* image */}
                <Grid item md={4} xs={6}>
                    <Container
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            gap: "20px",
                        }}
                    >
                        <Img
                            alt="complex"
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${infoTrack.imgUrl}`}
                            width={"200px"}
                            height={"200px"}
                        />
                        <InputFileUpload
                            setInfoTrack={setInfoTrack}
                            infoTrack={infoTrack}
                        />
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
                                value={infoTrack.title}
                                onChange={(e) =>
                                    setInfoTrack({
                                        ...infoTrack,
                                        title: e.target.value,
                                    })
                                }
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                id="fullWidth"
                                margin="dense"
                                value={infoTrack.description}
                                onChange={(e) =>
                                    setInfoTrack({
                                        ...infoTrack,
                                        description: e.target.value,
                                    })
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                id="outlined-select-currency"
                                select
                                label="Select"
                                defaultValue="CHILL"
                                helperText="Please select your category"
                                value={infoTrack.category}
                                onChange={(e) =>
                                    setInfoTrack({
                                        ...infoTrack,
                                        category: e.target.value,
                                    })
                                }
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
                                <Button
                                    variant="outlined"
                                    sx={{ mt: "20px" }}
                                    onClick={() => handleSubmitForm()}
                                >
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
