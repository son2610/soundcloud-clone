"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import { Theme, useTheme } from "@mui/material/styles";
import {
    Box,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/utils/toast";

interface IProps {
    tracks: ITrackTop[];
    playlists: IPlaylist[];
}

// handle track to playlists
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name: string, trackId: readonly string[], theme: Theme) {
    return {
        fontWeight:
            trackId.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

function AddPlaylistTrack(props: IProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const toast = useToast();
    const { playlists, tracks } = props;
    console.log("check playlist track", playlists);
    console.log("check tracks of track", tracks);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedPlaylist("");
        setTracksId([]);
        setOpen(false);
    };

    const [selectPlaylist, setSelectedPlaylist] = React.useState("");
    const handleChangePlaylist = (event: SelectChangeEvent) => {
        setSelectedPlaylist(event.target.value as string);
    };

    // handle track
    const theme = useTheme();
    const [trackId, setTracksId] = React.useState<string[]>([]);

    const handleTrackChange = (event: SelectChangeEvent<typeof trackId>) => {
        const {
            target: { value },
        } = event;
        // console.log("check event handleTrackChange", value);
        setTracksId(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );
    };
    const handleSaveAddTrack = async () => {
        if (!selectPlaylist) {
            toast.error("Vui lòng chọn playlist!");
            return;
        }
        if (!trackId.length) {
            toast.error("Vui lòng chọn tracks!");
            return;
        }

        const chosenPlaylist = playlists.find((i) => i._id === selectPlaylist);
        let tracks = trackId?.map((item) => item?.split("###")?.[1]);

        //remove null/undefined/empty
        tracks = tracks?.filter((item) => item);
        if (chosenPlaylist) {
            const res = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/playlists`,
                method: "PATCH",
                body: {
                    id: chosenPlaylist._id,
                    title: chosenPlaylist.title,
                    isPublic: chosenPlaylist.isPublic,
                    tracks: tracks,
                },
                headers: {
                    Authorization: `Bearer ${session?.access_token}`,
                },
            });

            if (res.data) {
                toast.success("Thêm track vào playlist thành công!");
                await sendRequest<IBackendRes<any>>({
                    url: `/api/revalidate`,
                    method: "POST",
                    queryParams: {
                        tag: "playlist-by-user",
                        secret: "justArandomString",
                    },
                });
                handleClose();
                router.refresh();
            } else {
                toast.error(res.message);
            }
        }
    };
    return (
        <React.Fragment>
            <Button
                variant="outlined"
                onClick={handleClickOpen}
                startIcon={<AddIcon />}
            >
                New Track to Playlist
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Thêm track vào playlist</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                            Add track to Playlist
                        </InputLabel>
                        <Select
                            labelId="select-playlist"
                            id="select-playlist"
                            value={selectPlaylist}
                            label="Add track to Playlist"
                            onChange={handleChangePlaylist}
                        >
                            {playlists.map((playlist) => {
                                return (
                                    <MenuItem
                                        value={playlist._id}
                                        key={playlist._id}
                                    >
                                        {playlist.title}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                        {/*  */}
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel id="demo-multiple-chip-label">
                                Tracks
                            </InputLabel>
                            <Select
                                labelId="demo-multiple-chip-label"
                                id="demo-multiple-chip"
                                multiple
                                value={trackId}
                                onChange={handleTrackChange}
                                input={
                                    <OutlinedInput
                                        id="select-multiple-chip"
                                        label="Chip"
                                    />
                                }
                                renderValue={(selected) => (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 0.5,
                                        }}
                                    >
                                        {selected.map((value) => (
                                            <Chip
                                                key={value}
                                                label={value?.split("###")?.[0]}
                                            />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {tracks.map((track) => {
                                    return (
                                        <MenuItem
                                            key={track._id}
                                            value={`${track.title}###${track._id}`}
                                            style={getStyles(
                                                `${track.title}###${track._id}`,
                                                trackId,
                                                theme
                                            )}
                                        >
                                            {/* name on list tracks */}
                                            {track.title}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSaveAddTrack}>Save</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default AddPlaylistTrack;
