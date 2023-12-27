"use client";

import { sendRequest } from "@/utils/api";
import { Box, Divider, Link, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React from "react";
import Image from "next/image";

function ClientSearchTracks() {
    const searchParams = useSearchParams();
    const inputSearch = searchParams.get("q");
    const [listSearch, setListSearch] = React.useState<ITrackTop[]>([]);

    const fetchData = async (query: string) => {
        const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/tracks/search`,
            method: "POST",
            body: {
                current: 1,
                pageSize: 10,
                title: inputSearch,
            },
        });
        if (res.data) {
            setListSearch(res?.data?.result);
        }
    };

    React.useEffect(() => {
        if (inputSearch) fetchData(inputSearch);
    }, [inputSearch]);
    console.log("check list search", listSearch);

    return (
        <>
            <Box sx={{ marginTop: "20px" }}>
                <Typography>
                    Kết quả tìm kiếm cho từ khoá:{" "}
                    <span style={{ fontWeight: "bold" }}>{inputSearch}</span>
                </Typography>
            </Box>
            <Divider />
            <Box>
                {listSearch.map((item) => {
                    return (
                        <Box
                            sx={{
                                display: "flex",
                                width: "100%",
                                gap: "40px",
                                marginY: "10px",
                            }}
                            key={item._id}
                        >
                            <img
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${item.imgUrl}`}
                                width={50}
                                height={50}
                                alt="cover track"
                            />
                            <Link
                                href={`/track/${item._id}?audio=${item.trackUrl}&id=${item._id}`}
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                }}
                            >
                                <Typography component="div" variant="h5">
                                    {item.title}
                                </Typography>
                            </Link>
                        </Box>
                    );
                })}
                {listSearch && <div> Không có kết quả với từ khoá bạn tìm</div>}
            </Box>
        </>
    );
}

export default ClientSearchTracks;
