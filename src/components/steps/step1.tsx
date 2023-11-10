"use client";

import React, { useCallback } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import "./themestep.css";
import InputFileUpload from "./InputFileUpload";

function Step1() {
    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        // Do something with the files
        console.log("check accepted file: ", acceptedFiles);
    }, []);

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop,
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
