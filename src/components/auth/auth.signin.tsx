"use client";

import React, { useState } from "react";
import {
    TextField,
    Button,
    Box,
    InputAdornment,
    IconButton,
    Container,
    Divider,
    Stack,
    Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoginIcon from "@mui/icons-material/Login";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn } from "next-auth/react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";

function AuthSignIn() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const router = useRouter();

    const [isOpenAlert, setisOpenAlert] = useState<boolean>(false);
    const [messegeAlert, setMessegeAlert] = useState<string>("");

    const handleSubmit = async (event: React.FormEvent<EventTarget>) => {
        event.preventDefault();

        setEmailError(false);
        setPasswordError(false);

        if (username == "") {
            setEmailError(true);
        }
        if (password == "") {
            setPasswordError(true);
        }

        if (username && password) {
            console.log(username, password);

            const res = await signIn("credentials", {
                username: username,
                password: password,
                redirect: false,
            });
            console.log("check res ", res);
            if (!res?.error) {
                //redirect to home
                router.push("/");
            } else {
                setisOpenAlert(true);
                setMessegeAlert(res.error);
            }
        }
    };

    // show hide password
    // Add these variables to your component to track the state
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    ///

    return (
        <>
            <Paper
                sx={{
                    p: 2,
                    marginX: "auto",
                    marginTop: "100px",
                    maxWidth: 600,
                    flexGrow: 1,
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} sm container>
                        <Box
                            component="form"
                            sx={{
                                "& > :not(style)": { m: 1, width: "100%" },
                            }}
                            noValidate
                            autoComplete="off"
                            onSubmit={handleSubmit}
                        >
                            <Link href="/">
                                <ArrowBackIcon
                                    style={{
                                        color: "blue",
                                        display: "block",
                                        position: "relative",
                                        left: "0px",
                                        width: "20px",
                                        cursor: "pointer",
                                    }}
                                />
                            </Link>

                            <Container
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                }}
                            >
                                <LoginIcon fontSize="large" />
                                <div style={{ paddingLeft: "10px" }}>
                                    Sign in
                                </div>
                            </Container>
                            <TextField
                                label="Username"
                                onChange={(e) => setUserName(e.target.value)}
                                required
                                variant="outlined"
                                color="primary"
                                type="username"
                                sx={{ mb: 3 }}
                                fullWidth
                                value={username}
                                error={emailError}
                                helperText={
                                    emailError ? "User do not empty" : ""
                                }
                            />

                            <TextField
                                label="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                variant="outlined"
                                color="primary"
                                value={password}
                                error={passwordError}
                                type={showPassword ? "text" : "password"}
                                helperText={
                                    passwordError ? "Password do not empty" : ""
                                }
                                fullWidth
                                sx={{ mb: 3 }}
                                InputProps={{
                                    // <-- This is where the toggle button is added.
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={
                                                    handleClickShowPassword
                                                }
                                                onMouseDown={
                                                    handleMouseDownPassword
                                                }
                                            >
                                                {showPassword ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button variant="contained" type="submit">
                                SIGN IN
                            </Button>
                            <Divider>Or Login with:</Divider>
                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <IconButton
                                    aria-label="github"
                                    color="primary"
                                    size="large"
                                    onClick={() => signIn("github")}
                                >
                                    <GitHubIcon fontSize="inherit" />
                                </IconButton>
                                <IconButton
                                    aria-label="github"
                                    color="primary"
                                    size="large"
                                >
                                    <GoogleIcon fontSize="inherit" />
                                </IconButton>
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>
                <Snackbar
                    open={isOpenAlert}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    // autoHideDuration={6000}
                    // onClose={false}
                >
                    <Alert
                        // onClose={false}
                        severity="error"
                        sx={{ width: "100%" }}
                        onClose={() => {
                            setisOpenAlert(false);
                        }}
                    >
                        {messegeAlert}
                    </Alert>
                </Snackbar>
            </Paper>
        </>
    );
}

export default AuthSignIn;
