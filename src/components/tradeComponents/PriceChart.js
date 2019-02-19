import React, { Component }from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
  BarSeries,
  CandlestickSeries,
  LineSeries
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
  CrossHairCursor,
  EdgeIndicator,
  MouseCoordinateY,
  CurrentCoordinate
} from "react-stockcharts/lib/coordinates";
import { ema, sma } from "react-stockcharts/lib/indicator";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip ,MovingAverageTooltip } from "react-stockcharts/lib/tooltip";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

class PriceChart extends Component {
  render() {

    const ema26 = ema()
      .id(0)
      .options({ windowSize: 26 })
      .merge((d, c) => {d.ema26 = c;})
      .accessor(d => d.ema26);

    const ema12 = ema()
      .id(1)
      .options({ windowSize: 12 })
      .merge((d, c) => {d.ema12 = c;})
      .accessor(d => d.ema12);


    const smaVolume70 = sma()
      .id(3)
      .options({ windowSize: 70, sourcePath: "volume" })
      .merge((d, c) => {d.smaVolume70 = c;})
      .accessor(d => d.smaVolume70);

    const { type, data: initialData, width, ratio, timeRange, ema12Visible, ema26Visible } = this.props;

    let xDisplayFormat = timeFormat("%I:%M %p");
    if(timeRange === "6h")
      xDisplayFormat = timeFormat("%m/%d %I:%M %p");
    if(timeRange === "1d")
      xDisplayFormat = timeFormat("%m/%d ");

    const candlesDisplayTexts = {
      d: "",
      o: "-> O: ",
      h: " H: ",
      l: " L: ",
      c: " C: ",
      v: " V: ",
      na: "n/a"
    }

    const calculatedData = ema12(ema26(smaVolume70(initialData)));
    const xScaleProvider = discontinuousTimeScaleProvider
      .inputDateAccessor(d => d.date);


    const {
      data,
      xScale,
      xAccessor,
      displayXAccessor,
    } = xScaleProvider(calculatedData);

    const end = xAccessor(last(data));
    const start = xAccessor(data[Math.max(0, data.length - 60)]);

    let xExtents = [start, end+1];

    return (
      <ChartCanvas
        height={window.innerHeight/2-100}
        ratio={ratio}
        width={width}
        margin={{ left: 10, right: 65, top: 10, bottom: 30 }}
        type={type}
        seriesName="MSFT"
        data={data}
        zoomEvent={false}
        panEvent={false}
        xScale={xScale}
        xExtents={xExtents}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
      >
        <Chart
          id={1}
          yExtents={[price => [price.high + ((price.high-price.low))*2, price.low - ((price.high-price.low))*1], ema12.accessor(), ema26.accessor()]}
        >
          <XAxis axisAt="bottom" orient="bottom" ticks={8} fontSize={11} innerTickSize={5} />
          <YAxis axisAt="right" orient="right" ticks={6} />

          <EdgeIndicator itemType="last" orient="right" edgeAt="right"
                         yAccessor={d => d.close}
                         fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}
                         arrowWidth={3}
          />
          <MouseCoordinateY
            at="right"
            orient="right"
            stroke="#3490DC"
            strokeWidth={1}
            fill="#FFFFFF"
            textFill="#22292F"
            arrowWidth={3}
            strokeDasharray="ShortDash"
            displayFormat={format(".2f")}
          />
          <CandlestickSeries />

          {ema12Visible && <LineSeries yAccessor={ema12.accessor()} stroke={ema12.stroke()} highlightOnHover />}
          {ema26Visible && <LineSeries yAccessor={ema26.accessor()} stroke={ema26.stroke()} highlightOnHover />}

          {ema12Visible && <CurrentCoordinate yAccessor={ema12.accessor()} fill={ema12.stroke()} />}
          {ema26Visible && <CurrentCoordinate yAccessor={ema26.accessor()} fill={ema26.stroke()} />}

          <OHLCTooltip forChart={1} origin={[120, 10]} xDisplayFormat={xDisplayFormat} volumeFormat={format(".1f")} displayTexts={candlesDisplayTexts} />
          <MovingAverageTooltip
            onClick={e => console.log(e)}
            origin={[2, 0]}
            options={[
              {
                yAccessor: ema12.accessor(),
                type: ema12.type(),
                stroke: ema12.stroke(),
                windowSize: ema12.options().windowSize,
              },
              {
                yAccessor: ema26.accessor(),
                type: ema26.type(),
                stroke: ema26.stroke(),
                windowSize: ema26.options().windowSize,
              },
            ]}
          />
        </Chart>

        <Chart
          id={2}
          height={50}
          yExtents={d => d.volume}
          origin={(w, h) => [0, h - 50]}
        >

          <BarSeries
            yAccessor={d => d.volume}
            fill={d => (d.close > d.open ? "#6BA583" : "#FF0000")}
          />

        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    );
  }
}

PriceChart.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["svg", "hybrid"]).isRequired
};

PriceChart.defaultProps = {
  type: "hybrid"
};
PriceChart = fitWidth(
  PriceChart
);

export default PriceChart;
