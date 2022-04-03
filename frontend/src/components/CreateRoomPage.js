import React, { Component, useState, setState } from "react";
import { Link } from "react-router-dom";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel, FormLabel } from "@material-ui/core"

const CreateRoomPage = (props) => {
    const defaultVotes = 2;
    const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
    const [guestCanPause, setGuestCanPause] = useState(true);

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
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    Create A Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText component="div">
                        <div align="center">Guest Control of Playback State</div>
                    </FormHelperText>
                    <RadioGroup
                        row
                        defaultValue="true"
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
                        defaultValue={defaultVotes}
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
            <Grid item xs={12} align="center">
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleRoomButtonPressed}
                >
                    Create A Room
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

export default CreateRoomPage;

/*
class &&&&&&&&&&&&&&&&&&&&&&&&&&&&
*/
// export default class CreateRoomPage extends Component {

//     defaultVotes = 2;
//     constructor(props) {
//         super(props);
//         this.state = {
//             guestCanPause: true,
//             voteToSkip: this.defaultVotes,
//         };
//         this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
//         this.handleVotesChange = this.handleVotesChange.bind(this);
//         this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
//     }

//     handleVotesChange(e) {
//         this.setState({
//             voteToSkip: e.target.value
//         });
//     }

//     handleGuestCanPauseChange(e) {
//         this.setState({
//             guestCanPause: e.target.value === "true" ? true : false
//         });
//     }

//     handleRoomButtonPressed() {
//         const requestOptions = {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 votes_to_skip: this.state.voteToSkip,
//                 guest_can_pause: this.state.guestCanPause,
//             }),
//         };
//         fetch("/api/create-room", requestOptions)
//             .then((response) => response.json())
//             .then((data) => console.log(data));
//     }
//     render() {
//         return (
//             <Grid container spacing={1}>
//                 <Grid item xs={12} align="center">
//                     <Typography component="h4" variant="h4">
//                         Create A Room
//                     </Typography>
//                 </Grid>
//                 <Grid item xs={12} align="center">
//                     <FormControl component="fieldset">
//                         <FormHelperText component="div">
//                             <div align="center">Guest Control of Playback State</div>
//                         </FormHelperText>
//                         <RadioGroup
//                             row
//                             defaultValue="true"
//                             onChange={this.handleGuestCanPauseChange}
//                         >
//                             <FormControlLabel
//                                 value="true"
//                                 control={<Radio color="primary" />}
//                                 label="Play/Pause"
//                                 labelPlacement="bottom"
//                             />
//                             <FormControlLabel
//                                 value="false"
//                                 control={<Radio color="secondary" />}
//                                 label="No Control"
//                                 labelPlacement="bottom"
//                             />
//                         </RadioGroup>
//                     </FormControl>
//                 </Grid>
//                 <Grid item xs={12} align="center">
//                     <FormControl>
//                         <TextField
//                             required={true}
//                             type="number"
//                             onChange={this.handleVotesChange}
//                             defaultValue={this.defaultVotes}
//                             inputProps={{
//                                 min: 1,
//                                 style: { textAlign: "center" },
//                             }}
//                         />
//                         <FormHelperText component="div">
//                             <div align="center">Votes Required To Skip Song</div>
//                         </FormHelperText>
//                     </FormControl>
//                 </Grid>
//                 <Grid item xs={12} align="center">
//                     <Button
//                         color="primary"
//                         variant="contained"
//                         onClick={this.handleRoomButtonPressed}
//                     >
//                         Create A Room
//                     </Button>
//                 </Grid>
//                 <Grid item xs={12} align="center">
//                     <Button color="secondary" variant="contained" to="/" component={Link}>
//                         Back
//                     </Button>
//                 </Grid>
//             </Grid>
//         );
//     }
// }