"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Box from "@mui/material/Box";
import { Divider, IconButton } from "@mui/material";

const MainSlider = () => {
    const settings: Settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };
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
                    ".pd": { padding: "0 10px" },
                    h3: {
                        border: "1px solid #ccc",
                        padding: "20px",
                        height: "200px",
                    },
                }}
            >
                <h2> Multiple items </h2>
                <Slider {...settings}>
                    <div className="pd">
                        <h3>1</h3>
                    </div>
                    <div className="pd">
                        <h3>2</h3>
                    </div>
                    <div className="pd">
                        <h3>3</h3>
                    </div>
                    <div className="pd">
                        <h3>4</h3>
                    </div>
                    <div className="pd">
                        <h3>5</h3>
                    </div>
                    <div className="pd">
                        <h3>6</h3>
                    </div>
                    <div className="pd">
                        <h3>7</h3>
                    </div>
                    <div className="pd">
                        <h3>8</h3>
                    </div>
                    <div className="pd">
                        <h3>9</h3>
                    </div>
                </Slider>
                <Divider />
            </Box>

            <Box
                sx={{
                    margin: "0 50px",
                    ".pd": { padding: "0 10px" },
                    h3: {
                        border: "1px solid #ccc",
                        padding: "20px",
                        height: "200px",
                    },
                }}
            >
                <h2> Multiple items </h2>
                <Slider {...settings}>
                    <div className="pd">
                        <h3>1</h3>
                    </div>
                    <div className="pd">
                        <h3>2</h3>
                    </div>
                    <div className="pd">
                        <h3>3</h3>
                    </div>
                    <div className="pd">
                        <h3>4</h3>
                    </div>
                    <div className="pd">
                        <h3>5</h3>
                    </div>
                    <div className="pd">
                        <h3>6</h3>
                    </div>
                    <div className="pd">
                        <h3>7</h3>
                    </div>
                    <div className="pd">
                        <h3>8</h3>
                    </div>
                    <div className="pd">
                        <h3>9</h3>
                    </div>
                </Slider>
                <Divider />
            </Box>

            <Box
                sx={{
                    margin: "0 50px",
                    ".pd": { padding: "0 10px" },
                    h3: {
                        border: "1px solid #ccc",
                        padding: "20px",
                        height: "200px",
                    },
                }}
            >
                <h2> Multiple items </h2>
                <Slider {...settings}>
                    <div className="pd">
                        <h3>1</h3>
                    </div>
                    <div className="pd">
                        <h3>2</h3>
                    </div>
                    <div className="pd">
                        <h3>3</h3>
                    </div>
                    <div className="pd">
                        <h3>4</h3>
                    </div>
                    <div className="pd">
                        <h3>5</h3>
                    </div>
                    <div className="pd">
                        <h3>6</h3>
                    </div>
                    <div className="pd">
                        <h3>7</h3>
                    </div>
                    <div className="pd">
                        <h3>8</h3>
                    </div>
                    <div className="pd">
                        <h3>9</h3>
                    </div>
                </Slider>
                <Divider />
            </Box>
        </>
    );
};

export default MainSlider;
