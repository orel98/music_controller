import React, { Component, useState, setState, } from "react";
import { Grid, Button, Typography } from "@material-ui/core";

import CreateRoomPage from "./CreateRoomPage";

const Room = (props) => {
    const defaultValue = 2;
    const [votesToSkip, setVotesToSkip] = useState(defaultValue);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);

    const [showSettings, setShowSettings] = useState(false);
    const roomCode = props.match.params.roomCode;

    const updateShowSettings = () => {
        console.log("show settings")
        setShowSettings(showSettings ? false : true);
    }

    const renderSettings = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPage update={true} votesToSkip={votesToSkip} guestCanPause={guestCanPause} roomCode={roomCode} updateCallBack={() => { }} />

                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={() => {
                        updateShowSettings()
                    }}>
                        Close
                    </Button>
                </Grid>
            </Grid>
        )
    }

    const renderSettingsButton = () => {

        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={updateShowSettings}>
                    Settings
                </Button>
            </Grid>
        );
    }

    const leaveButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: { "ContentType": "application/json" },
        }
        fetch("/api/leave-room", requestOptions)
            .then((_response) => {
                props.leaveRoomCallback();
                props.history.push("/");
            });
    };
    const getRoomDetails = () => {
        fetch(`/api/get-room?code=${roomCode}`)
            .then((response) => {
                if (!response.ok) {
                    props.leaveRoomCallback();
                    props.history.push("/");
                }
                return response.json()
            })
            .then((data) => {
                setVotesToSkip(data.votes_to_skip),
                    setGuestCanPause(data.guest_can_pause),
                    setIsHost(data.is_host)
            });
    };

    getRoomDetails();
    if (showSettings) {
        return renderSettings();
    }
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code: {roomCode}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Votes: {votesToSkip}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Guest Can Pause: {guestCanPause}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Host: {isHost.toString()}
                </Typography>
            </Grid>
            {isHost ? renderSettingsButton() : null}
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
                    Leave Room
                </Button>
            </Grid>
        </Grid>

    );
}

export default Room;