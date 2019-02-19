import React from "react";
import PropTypes from "prop-types";

import { ChartCanvas, Chart } from "react-stockcharts";
import {scaleLinear} from "d3-scale";
import { HoverTooltip } from "react-stockcharts/lib/tooltip";
import { AreaSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";
import { curveStepBefore } from 'd3-shape';


// import { format } from "d3-format";
// import { timeFormat } from "d3-time-format";

// const dateFormat = timeFormat("%Y-%m-%d");
// const numberFormat = format(".2f");
function tooltipContent(ys) {
  return ({ currentItem, xAccessor }) => {
    return {
      x: xAccessor(currentItem)+" USD",
      y: [
        {
          label: currentItem.bidstotalvolume?  "Can be sold" : "Can be bought ",
          value: currentItem.bidstotalvolume? currentItem.bidstotalvolume: currentItem.askstotalvolume// && numberFormat(currentItem.open)
        },
        {
          label: "For a total of ",
          value: currentItem.bidstotalvolume? currentItem.bidstotalvolume * currentItem: currentItem.askstotalvolume*currentItem //&& numberFormat(currentItem.high)
        },
      ]
        .concat(
          ys.map(each => ({
            label: each.label,
            value: each.value(currentItem),
            stroke: each.stroke
          }))
        )
        .filter(line => line.value)
    };
  };
}



class DepthChart extends React.Component {

  render() {
    const { data, type, width, ratio, xExtend} = this.props;
    return (
      <div>
        <ChartCanvas ratio={ratio} width={width} height={window.innerHeight/2-110}
                     margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
                     seriesName="MSFT"
                     data={data} type={type}
                     xAccessor={d => d.price}
                     xExtents={xExtend}
                     xScale={scaleLinear()}
                     flipXScale={false}
                     panEvent={false}
                     zoomEvent={false}
                     displayXAccessor={d=>d.price}
        >
            <Chart id={0} yExtents={d => [d.bidstotalvolume, d.askstotalvolume]}>
            <XAxis axisAt="bottom" orient="bottom" ticks={6} />
            <YAxis axisAt="left" orient="left" />
            <YAxis axisAt="right" orient="right" />
            <AreaSeries  interpolation={curveStepBefore} yAccessor={d => d.bidstotalvolume ? d.bidstotalvolume : 0} fill="green" stroke="green" strokeWidth={2} style={{opacity: 0.4}}/>
            <AreaSeries  interpolation={curveStepBefore} yAccessor={d => d.askstotalvolume ? d.askstotalvolume : 0} fill="red"  stroke="red" strokeWidth={2} style={{opacity: 0.4}}/>
              <HoverTooltip
                tooltipContent={tooltipContent([])}
                fontSize={15}
              />
          </Chart>
        </ChartCanvas>
      </div>
    );
  }
}


DepthChart.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  xExtend: PropTypes.array.isRequired,
  type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

DepthChart.defaultProps = {
  type: "svg",
};
DepthChart = fitWidth(DepthChart);

export default DepthChart;

