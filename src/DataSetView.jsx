import React, {useState} from "react";
import {Grid} from "@mui/material";
import DetailedView from "./DetailedView";
import Box from "@mui/material/Box";
import BGCTable from "./BGCTable";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";




function DataSetView(props) {
    console.log(props.BGCs)
    const [selectedBGC, selectBGC] = useState(undefined);
    const [visType, setVisType] = useState("heatmap");
    let detailedView = null;
    if (selectedBGC !== undefined) {
        const highlightDict = {};
        props.BGCs[selectedBGC].stats.bio_genes.forEach(gene => highlightDict[gene] = "core biosynthetic gene")
        props.BGCs[selectedBGC].stats.bio_add_genes.forEach(gene => highlightDict[gene] = "additional biosynthetic gene")
        Object.values(props.BGCs[selectedBGC].genes).filter(gene => gene.regulator !== "N/A").forEach(gene => highlightDict[gene.protein_name] = "regulator");
        detailedView = <DetailedView genes={Object.keys(props.BGCs[selectedBGC].genes)}
                                     geneDict={props.BGCs[selectedBGC].genes} highlightDict={highlightDict}
                                     categories={["core biosynthetic gene", "additional biosynthetic gene", "regulator"]}
                                     selectBGC={selectBGC}/>
    }
    return (
        <div>
            <Box sx={{flexGrow: 1}}>
                <Grid container spacing={2}>
                    {selectedBGC !== undefined ?
                        <Grid item xs={12}>
                            {detailedView}
                        </Grid> :
                        [<Grid item xs={12}>
                        </Grid>,
                            <Grid item xs={12}>
                                <FormControl>
                                    <InputLabel id="demo-simple-select-label">BGC Visualization</InputLabel>
                                    <Select
                                        value={visType}
                                        label="BGC Visualization"
                                        onChange={(e) => setVisType(e.target.value)}
                                    >
                                        <MenuItem value={"heatmap"}>Heatmap</MenuItem>
                                        <MenuItem value={"gene"}>Core Gene View</MenuItem>
                                    </Select>
                                </FormControl>
                                <BGCTable data={props.BGCs} selectBGC={selectBGC} visType={visType}/>
                            </Grid>]}
                </Grid>
            </Box>
        </div>
    );
}

export default DataSetView;
