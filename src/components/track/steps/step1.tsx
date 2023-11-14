"use client";

import React, { useCallback } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import "./themestep.css";
import InputFileUpload from "./InputFileUpload";
import { useSession } from "next-auth/react";
import axios from "axios";

interface IProps {
    setValue: (value: number) => void;
    setTrackUpload: any;
    trackUpload: any;
}
function Step1(props: IProps) {
    const { data: session } = useSession();
    const { trackUpload } = props;
    // const [percent, setPercent] = React.useState(0);

    const onDrop = useCallback(
        async (acceptedFiles: FileWithPath[]) => {
            // Do something with the files
            const audio = acceptedFiles[0];
            props.setValue(1);
            const formData = new FormData();
            formData.append("fileUpload", audio);
            if (acceptedFiles && acceptedFiles[0]) {
                try {
                    let percentCompleted = 0;
                    const res = await axios.post(
                        "http://localhost:8000/api/v1/files/upload",
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${session?.access_token}`, // notice the Bearer before your token
                                target_type: "tracks",
                                delay: 5000,
                            },
                            onUploadProgress: (progressEvent) => {
                                percentCompleted = Math.floor(
                                    (progressEvent.loaded * 100) /
                                        progressEvent.total!
                                );
                                // setPercent(percentCompleted);
                                props.setTrackUpload({
                                    ...trackUpload,
                                    fileName: acceptedFiles[0].name,
                                    percent: percentCompleted,
                                });
                            },
                        }
                    );
                    props.setTrackUpload((prevState: any) => ({
                        ...prevState,
                        uploadedTrackName: res.data.data.fileName,
                    }));
                    console.log("check percentCompleted", percentCompleted);
                } catch (err) {
                    // @ts-ignore
                    console.log("check error", err?.message);
                }
            }
            console.log("check accepted file audio:  ", session?.access_token);
        },
        [session]
    );

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "audio/mpeg": [],
        },
    });

    const files = acceptedFiles.map((file: FileWithPath) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <section className="container">
            <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <InputFileUpload />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
            </aside>
        </section>
    );
}

export default Step1;
