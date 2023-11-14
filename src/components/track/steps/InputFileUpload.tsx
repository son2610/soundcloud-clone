import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { useSession } from "next-auth/react";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

export default function InputFileUpload(props: any) {
    const { data: session } = useSession();
    const handleUploadImage = async (image: any) => {
        const { infoTrack, setInfoTrack } = props;
        const formData = new FormData();
        formData.append("fileUpload", image);
        try {
            // let percentCompleted = 0;
            const res = await axios.post(
                "http://localhost:8000/api/v1/files/upload",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${session?.access_token}`, // notice the Bearer before your token
                        target_type: "images",
                    },
                    // onUploadProgress: (progressEvent) => {
                    //     percentCompleted = Math.floor(
                    //         (progressEvent.loaded * 100) /
                    //             progressEvent.total!
                    //     );
                    // setPercent(percentCompleted);
                    // props.setTrackUpload({
                    //     ...infoTrack,
                    //     imgUrl: ,
                    // });
                    //     },
                }
            );
            // props.setTrackUpload({
            //     ...trackUpload,
            //     uploadedTrackName: res.data.data.fileName,
            // });
            // console.log("check percentCompleted", percentCompleted);
            console.log("tessttttttttttttttttttttt");
            setInfoTrack({
                ...infoTrack,
                imgUrl: res.data.data.fileName,
            });
        } catch (err) {
            // @ts-ignore
            console.log("check error", err?.message);
        }
    };

    return (
        <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            // onClick={(event) => event.preventDefault()}
            onChange={(e) => {
                const event = e.target as HTMLInputElement;
                if (event.files) {
                    handleUploadImage(event.files[0]);
                    console.log("check event target file", event.files[0]);
                }
            }}
        >
            Upload file
            <VisuallyHiddenInput type="file" />
        </Button>
    );
}
