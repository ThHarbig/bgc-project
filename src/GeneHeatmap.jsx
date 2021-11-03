import * as d3 from "d3";
import React from "react";
import PropTypes from 'prop-types';
import Tooltip from "@mui/material/Tooltip";


function GeneHeatmap(props) {
    const margin = {
        top: 0,
        bot: 0,
        left: 0,
        right: 0,

    }
    const width = props.width - (margin.left + margin.right);
    const height = props.height - (margin.top + margin.bot);


    const colorScale = d3.scaleLinear().domain([-props.colorRange, 0, props.coreGenes]).range(["blue", "white", "red"]);


    let geneElements;
    const numGenes = Object.keys(props.geneDict).length

    geneElements = Object.keys(props.geneDict).map((key, i) => {
        const geneLen = width / numGenes;
        let highlightRect = null;
        if (props.coreGenes.includes(key)) {
            highlightRect = <rect width={geneLen} height={height} fill={"lightGray"}/>
        }
        if (props.geneDict[key].fold_change !== "NA") {
            return <g transform={"translate(" + i * geneLen + ",0)"}>
                {highlightRect}
                <Tooltip placement={"bottom-end"}
                         title={<React.Fragment>
                             <b>Gene name:</b> {props.geneDict[key].gene_name}
                             <br/>
                             <b>Product:</b> {props.geneDict[key].product}
                             <br/>
                             <b>Fold Change:</b> {props.geneDict[key].fold_change}
                         </React.Fragment>}>
                    <rect width={geneLen}
                          height={height / 2} y={height / 4} fill={colorScale(props.geneDict[key].fold_change)}
                          stroke={"white"}/>
                </Tooltip>
            </g>
        } else return null;
    })
    return (
        <svg width={props.width} height={props.height}>
            <g transform={"translate(" + margin.left + "," + margin.top + ")"}>
                {geneElements}
            </g>
        </svg>
    );
}

GeneHeatmap.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    geneDict: PropTypes.object.isRequired,
    coreGenes: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default GeneHeatmap;
