"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Box from "@mui/material/Box";
import { Divider, IconButton } from "@mui/material";
import Link from "next/link";

interface IProps {
    dataProps: ITrackTop[];
    titleProp: string;
}
const MainSlider = (prop: IProps) => {
    const settings: Settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    const { dataProps, titleProp } = prop;

    function NextArrow(props: any) {
        const { className, style, onClick } = props;
        return (
            <IconButton
                color="primary"
                aria-label="Next"
                onClick={onClick}
                sx={{
                    position: "absolute",
                    top: "50%",
                    right: "-25px",
                    width: "35px",
                    minWidth: "30px",
                }}
            >
                <ArrowForwardIosIcon />
            </IconButton>
        );
    }

    function PrevArrow(props: any) {
        const { className, style, onClick } = props;
        return (
            <IconButton
                color="primary"
                aria-label="Next"
                onClick={onClick}
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "-25px",
                    width: "35px",
                    minWidth: "30px",
                }}
            >
                <ArrowBackIosIcon />
            </IconButton>
        );
    }
    return (
        <>
            <Box
                sx={{
                    margin: "0 50px",
                    ".track": { padding: "0 10px" },
                    h4: {
                        // border: "1px solid #ccc",
                        padding: "20px",
                        overflow: "hidden",
                    },
                    img: {
                        wdth: 150,
                        height: 150,
                    },
                }}
            >
                <h2> {titleProp} </h2>
                <Slider {...settings}>
                    {dataProps.map((track) => {
                        return (
                            <div className="track" key={track._id}>
                                <img
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                                />
                                <Link
                                    href={`/track/${track._id}?audio=${track.trackUrl}`}
                                >
                                    <h4>{track.title}</h4>
                                </Link>
                                <h5>{track.description}</h5>
                            </div>
                        );
                    })}
                </Slider>
                <Divider />
            </Box>
        </>
    );
};

export default MainSlider;
