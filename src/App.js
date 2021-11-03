import React, {useCallback, useEffect, useState} from "react";
import {Grid} from "@mui/material";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DataSetView from "./DataSetView";
import {getBGCs, getComparisons} from "./api";


function App() {
    const [selectedComparison, setComparison] = useState(undefined);
    const [comparisons, setComparisons] = useState([])
    const [BGCs, setBGCs] = useState({});
    const windowUrl = window.location.pathname.slice(1);
    const selectComparison = useCallback((comparison) => {
        getBGCs(windowUrl, comparison, (response) => {
            setComparison(response.data)
            setBGCs(response.data)
        })
    }, [setBGCs, windowUrl])
    useEffect(() => {
        getComparisons(windowUrl, (response) => {
            setComparisons(response.data);
        });
    }, [windowUrl])

    return (
        <div>
            <Box sx={{flexGrow: 1}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl>
                            <InputLabel id="demo-simple-select-label">BGC Visualization</InputLabel>
                            <Select
                                value={selectedComparison}
                                label="BGC Visualization"
                                onChange={(e) => selectComparison(e.target.value)}
                            >
                                {comparisons.map(comparison => {
                                    return (<MenuItem value={comparison}>{comparison}</MenuItem>)
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        {Object.keys(BGCs).length > 0 ?
                            <DataSetView BGCs={BGCs}/> : null}
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}

export default App;
