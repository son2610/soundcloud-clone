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
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoginIcon from "@mui/icons-material/Login";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

function AuthSignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const handleSubmit = (event: React.FormEvent<EventTarget>) => {
        event.preventDefault();

        setEmailError(false);
        setPasswordError(false);

        if (email == "") {
            setEmailError(true);
        }
        if (password == "") {
            setPasswordError(true);
        }

        if (email && password) {
            console.log(email, password);
            setEmail("");
            setPassword("");
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
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                variant="outlined"
                                color="primary"
                                type="email"
                                sx={{ mb: 3 }}
                                fullWidth
                                value={email}
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
            </Paper>
        </>
    );
}

export default AuthSignIn;
