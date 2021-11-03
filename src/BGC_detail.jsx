import * as d3 from "d3";
import React, {useCallback} from "react";
import PropTypes from 'prop-types';
import Axis from "./Axis";
import Tooltip from "@mui/material/Tooltip";


function BGC_detail(props) {
    const margin = {
        top: 0,
        bot: 0,
        left: props.showAxis ? 60 : 5,
        right: 5,

    }
    const width = props.width - (margin.left + margin.right);
    const height = props.height - (margin.top + margin.bot);

    let yScale;
    if (!props.yRange) {
        const foldChanges = props.genes.map(gene => parseFloat(props.geneDict[gene].fold_change));
        const yMin = d3.min(foldChanges);
        const yMax = d3.max(foldChanges);
        let range = yMax;
        if (Math.abs(yMin) > yMax) {
            range = Math.abs(yMin)
        }

        yScale = d3.scaleLinear().domain([-range, range]).range([height, 0]);
    } else {
        yScale = d3.scaleLinear().domain([-props.yRange, props.yRange]).range([height, 0]);

    }
    let colorScale;
    if (props.highlightDict) {
        colorScale = d3.scaleOrdinal().domain(props.categories).range(["gold", "green", "darkgreen", "pink", "brown", "slateblue", "grey1", "orange", "yellow", "black", "grey"])
    } else {
        colorScale = d3.scaleOrdinal().domain([true, false]).range(["red", "blue"])
    }

    const arrowWidth = 5;
    const geneHeight = 5;


    const createArrowHead = useCallback((start, fill, reverse) => {
        if (reverse) {
            return (<polygon
                points={start + "," + geneHeight / 2 + " " + arrowWidth + ",0 " + arrowWidth + "," + geneHeight}
                fill={fill}/>)
        } else {
            return (<polygon
                points={start + ",0 " + (start + arrowWidth) + "," + geneHeight / 2 + " " + start + "," + geneHeight}
                fill={fill}/>)
        }

    }, [])
    let geneElements;
    const positions = props.genes.map(gene => [props.geneDict[gene].gene_start, props.geneDict[gene].gene_end]).flat();
    const xMin = d3.min(positions);
    const xMax = d3.max(positions);
    const xScale = d3.scaleLinear().domain([xMin, xMax]).range([0, width]);
    const numGenes = props.genes.length

    geneElements = props.genes.map((gene, i) => {
        let offset = 0;
        let arrowhead;
        let geneLen;
        let translate;
        if (!props.isCompressed) {
            geneLen = xScale(props.geneDict[gene].gene_end) - xScale(props.geneDict[gene].gene_start);
            translate = "translate(" + xScale(props.geneDict[gene].gene_start) + "," + (yScale(props.geneDict[gene].fold_change) - 0.5 * geneHeight) + ")";
        } else {
            geneLen = width / numGenes;
            translate = "translate(" + i * geneLen + "," + yScale(props.geneDict[gene].fold_change) + ")"
        }
        let fill;
        if (props.highlightDict) {
            if (Object.keys(props.highlightDict).includes(gene)) {
                fill = colorScale(props.highlightDict[gene])
            } else {
                fill = "gray"
            }
        } else {
            fill = colorScale(props.geneDict[gene].fold_change > 0)
        }

        if (props.geneDict[gene].strand === "1") {
            const start = geneLen - arrowWidth;
            arrowhead = createArrowHead(start, fill, false)
        } else {
            offset = arrowWidth;
            arrowhead = createArrowHead(0, fill, true)
        }

        return <Tooltip placement={"bottom-end"}
                        title={<React.Fragment>
                            <b>Gene name:</b> {props.geneDict[gene].gene_name}
                            <br/>
                            <b>Product:</b> {props.geneDict[gene].product}
                            <br/>
                            <b>Fold Change:</b> {props.geneDict[gene].fold_change}
                        </React.Fragment>}>
            <g transform={translate}>
                <rect x={offset} width={geneLen - arrowWidth}
                      height={geneHeight} fill={fill}/>
                {arrowhead}
            </g>
        </Tooltip>

    })
    const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(3)
    return (
        <svg width={props.width} height={props.height}>
            <g transform={"translate(" + margin.left + "," + margin.top + ")"}>
                <line x1={0} x2={width} y1={yScale(0)} y2={yScale(0)} stroke={"black"}/>
                {geneElements}
                {props.showAxis ? <Axis h={height} w={width} axis={yAxis} axisType={'y'} label={"FC"}/> : null}
            </g>
        </svg>
    );
}

BGC_detail.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    genes: PropTypes.arrayOf(PropTypes.string).isRequired,
    geneDict: PropTypes.object.isRequired,
    highlightDict: PropTypes.object,
    categories: PropTypes.arrayOf(PropTypes.string),
    isCompressed: PropTypes.bool.isRequired,
    showAxis: PropTypes.bool,
    yRange: PropTypes.number,
}
BGC_detail.defaultProps = {
    showAxis: true,
}

export default BGC_detail;
