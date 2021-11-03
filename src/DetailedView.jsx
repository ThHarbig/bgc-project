import BGC_detail from "./BGC_detail";
import {Grid, IconButton} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, {useState} from "react";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

function DetailedView(props) {
    const [abstraction, setAbstraction] = useState("no");
    return <Grid container>
        <Grid item xs={12}>
            <IconButton onClick={() => props.selectBGC(undefined)}><ArrowBackIcon/></IconButton>
        </Grid>
        <Grid item xs={2}>

            <FormControl>
                <InputLabel id="demo-simple-select-label">Abstraction</InputLabel>
                <Select
                    value={abstraction}
                    label="Abstraction"
                    onChange={(e) => setAbstraction(e.target.value)}
                >
                    <MenuItem value={"no"}>Expanded</MenuItem>
                    <MenuItem value={"all"}>Compress everything</MenuItem>
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={10}>
            <BGC_detail genes={props.genes} height={200} isCompressed={abstraction !== "no"} width={1000}
                        geneDict={props.geneDict} highlightDict={props.highlightDict} categories={props.categories}/>
        </Grid>
    </Grid>
}

export default DetailedView;