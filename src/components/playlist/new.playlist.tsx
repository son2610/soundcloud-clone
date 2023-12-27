"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Switch } from "@mui/material";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import { useToast } from "@/utils/toast";

const NewPlaylist = () => {
    const [open, setOpen] = React.useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const toast = useToast();

    // Switch handlers
    const [checked, setChecked] = React.useState(true);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };
    //

    const [textInput, setTextInput] = React.useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        if (!textInput) {
            toast.error("Tên playlist không được để trống!!!");
            return;
        }
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/playlists/empty`,
            method: "POST",
            body: { title: textInput, isPublic: checked },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            },
        });
        console.log("check data add new playlist: ", res);
        if (res) {
            setTextInput("");
            setOpen(false);
            toast.success("Thêm Playlist thành công");

            await sendRequest<IBackendRes<any>>({
                url: `/api/revalidate`,
                method: "POST",
                queryParams: {
                    tag: "playlist-by-user",
                    secret: "justArandomString",
                },
            });
            router.refresh();
        } else {
            toast.error("Lỗi rồi nè bạn ơi !!!");
        }
    };

    return (
        <>
            <Button
                variant="outlined"
                onClick={handleClickOpen}
                startIcon={<AddIcon />}
            >
                New Playlist
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Thêm mới Playlist</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Tiêu đề"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setTextInput(e.target.value)}
                    />
                    <Switch
                        checked={checked}
                        onChange={handleChange}
                        inputProps={{ "aria-label": "controlled" }}
                        // lable:
                    />
                    <span>{checked ? "Public" : "Private"}</span>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default NewPlaylist;
