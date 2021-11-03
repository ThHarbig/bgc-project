import React, {useState} from "react";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import PropTypes from 'prop-types';
import BGC_detail from "./BGC_detail";
import {Button} from "@mui/material";
import * as d3 from "d3";
import GeneHeatmap from "./GeneHeatmap";


function BGCTable(props) {
    const yRange = d3.max(Object.values(props.data).map(d => d3.max(d.stats.bio_genes.map((gene) => Math.abs(d.genes[gene].fold_change)))));
    const rows = Object.entries(props.data).map(([key, value]) => {
        return <TableRow key={key}>
            <TableCell>{key}</TableCell>
            <TableCell align="right">{Math.round(value.stats.fold_change_biosynthetic * 100) / 100}</TableCell>
            <TableCell align="left">{
                props.visType === "heatmap" ?
                    <GeneHeatmap width={200} height={50} geneDict={value.genes} coreGenes={value.stats.bio_genes} colorRange={yRange}/> :
                    <BGC_detail width={200} height={50} geneDict={value.genes}
                                genes={value.stats.bio_genes} isCompressed={true}
                                yRange={yRange}
                                showAxis={true} selectBGC={props.selectBGC}/>
            }

            </TableCell>
            <TableCell align="right"><Button onClick={() => props.selectBGC(key)}>Show Detail</Button></TableCell>
        </TableRow>
    })
    return (<TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Avg. FC</TableCell>
                        <TableCell align="left">Core biosynthetic genes</TableCell>
                        <TableCell/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

BGCTable.propTypes = {
    data: PropTypes.object.isRequired
}
export default BGCTable;