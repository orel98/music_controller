import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel, FormLabel } from "@material-ui/core"
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";


const CreateRoomPage = (props) => {


    const votesToSkipDefaultVotes = 2;
    const [votesToSkip, setVotesToSkip] = useState(votesToSkipDefaultVotes);
    const [guestCanPause, setGuestCanPause] = useState(true);
    // const [update, setUpdate] = useState(false);
    // const [roomCode, setRoomCode] = useState(null);
    // const [updateCallBack, setUpdateCallBack] = useState(() => { });
    const [successMsg, setSuccessMsg] = useState("");
    const [errMsg, setErrMsg] = useState("");

    const handleVotesChange = (e) => {
        setVotesToSkip(e.target.value);
    }

    const handleGuestCanPauseChange = (e) => {
        setGuestCanPause(
            e.target.value === "true" ? true : false
        )
    }

    const handleRoomButtonPressed = (e) => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
            }),
        };
        fetch("/api/create-room", requestOptions)
            .then((response) => response.json())
            .then((data) => props.history.push(`/room/${data.code}`));

    }

    const handleUpdateButtonPressed = (e) => {
        const requestOptions = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
                code: props.roomCode
            }),
        };

        fetch("/api/update-room", requestOptions)
            .then((response) => {
                if (response.ok) {
                    setSuccessMsg("Room updated successfully!");
                } else {
                    setErrMsg("Error updating room...");
                }
            })
    }

    const renderCreateButtons = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={handleRoomButtonPressed}>
                        Create a Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        );
    }

    const renderUpdateButtons = () => {
        return (
            <Grid item xs={12} align="center">
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleUpdateButtonPressed}>
                    Update Room
                </Button>
            </Grid>
        );
    }

    const title = props.update ? "Update Room" : "Create a Room";
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Collapse in={(successMsg || errMsg) ? true : false}>
                    {successMsg ? (
                        <Alert severity="success" onClose={() => { setSuccessMsg("") }}>{successMsg}</Alert>
                    ) : (
                        <Alert severity="error" onClose={() => { setErrMsg("") }}>{errMsg}</Alert>
                    )}

                </Collapse>
                <Typography component="h4" variant="h4">
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText component="div">
                        <div align="center">Guest Control of Playback State</div>
                    </FormHelperText>
                    <RadioGroup
                        row
                        defaultValue={props.guestCanPause.toString()}
                        onChange={handleGuestCanPauseChange}
                    >
                        <FormControlLabel
                            value="true"
                            control={<Radio color="primary" />}
                            label="Play/Pause"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel
                            value="false"
                            control={<Radio color="secondary" />}
                            label="No Control"
                            labelPlacement="bottom"
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField
                        required={true}
                        type="number"
                        onChange={handleVotesChange}
                        defaultValue={votesToSkip}
                        inputProps={{
                            min: 1,
                            style: { textAlign: "center" },
                        }}
                    />
                    <FormHelperText component="div">
                        <div align="center">Votes Required To Skip Song</div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            {props.update ? renderUpdateButtons() : renderCreateButtons()}
        </Grid>
    );
}

export default CreateRoomPage;