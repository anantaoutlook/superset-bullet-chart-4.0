"use strict";

exports.__esModule = true;
exports.default = SupersetBulletChartV4;

var _react = _interopRequireWildcard(require("react"));

var _core = require("@superset-ui/core");

var d3 = _interopRequireWildcard(require("d3"));

var d3Scale = _interopRequireWildcard(require("d3-scale"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var categorialSchemeRegistry = (0, _core.getCategoricalSchemeRegistry)(); // The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled
// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

/* const Styles = styled.div<SupersetBulletChartV4StylesProps>`
  background-color: ${({ theme }) => theme.colors.secondary.light5};
   padding: ${({ theme }) => theme.gridUnit * 4}px;
   border-radius: ${({ theme }) => theme.gridUnit * 2}px;
   height: ${({ height }) => height}px;
   width: ${({ width }) => width}px;
 `; */

/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */

function SupersetBulletChartV4(props) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  var {
    data,
    height,
    colorScheme,
    width,
    orderDesc,
    bulletColorScheme
  } = props;
  var svgRef = /*#__PURE__*/(0, _react.createRef)(); // Often, you just want to get a hold of the DOM and go nuts.
  // Here, you can do that with createRef, and the useEffect hook.

  (0, _react.useEffect)(() => {
    render(svgRef);
  }, [props, orderDesc, colorScheme, bulletColorScheme]);

  var render = svgRef => {
    // custom colors theme
    var customColors;
    var colorsValues = categorialSchemeRegistry.values();
    var filterColors = colorsValues.filter(c => c.id === colorScheme);
    var findLegendColorScheme = colorsValues.filter(c => c.id === bulletColorScheme);

    if (filterColors[0]) {
      customColors = [...filterColors[0].colors];
    }

    var legendBulletColor = [];

    if (findLegendColorScheme[0]) {
      legendBulletColor = [...findLegendColorScheme[0].colors];
    }

    var groupData = (data, total) => {
      var cumulative = 0;

      var _data = data.map(d => {
        cumulative += d.metricpossiblevalues;
        return {
          metricpossiblevalues: d.metricpossiblevalues,
          cumulative: cumulative - d.metricpossiblevalues,
          metricvalue: d.metricvalue,
          company: d.company,
          metricpossible: d.metricpossible,
          percent: (d.metricpossiblevalues / total * 100).toFixed(2)
        };
      }).filter(d => d.metricpossiblevalues > 0);

      return _data;
    };

    var config = {
      f: d3.format('.1f'),
      margin: {
        top: 20,
        right: 10,
        bottom: 20,
        left: 10
      },
      barHeight: 40
    };
    var {
      f,
      margin,
      barHeight
    } = config;
    var w = width - margin.left - margin.right;
    var h = height - margin.top - margin.bottom;
    var halfBarHeight = barHeight;
    var lineHeight = 1.1; //

    var getMetricPossible = data => {
      var rectangles = selection.selectAll('rect') || null;
      data.each(function () {
        var filterVal = rectangles[0].filter((d, eleIndex) => data[0].indexOf(this) === eleIndex);

        if (filterVal.length > 0) {
          wrap(this, parseFloat(filterVal[0].attributes[4].value) + 5);
        }
      });
    }; // wrap text


    var wrap = (txt, data) => {
      var width = data;
      var text = d3.select(txt);
      var words = text.text().split(/\s+/).reverse();
      var word;
      var line = [];
      var lineNumber = 0;
      var lineHeight = 1.1; // ems

      var x = text.attr('x');
      var y = text.attr('y');
      var dy = parseFloat(text.attr('dy')) || 0;
      var tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');

      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(' '));
        var tspanWidth = tspan.node().getComputedTextLength() + 1;

        if (tspanWidth > width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
        }
      }
    }; // find unique metric value


    function creatUniqueArray() {
      var unique = [];
      var distinct = []; // const result = [];

      for (var i = 0; i < data.length; i++) {
        if (data[i].metricpossible) {
          if (!unique[data[i].metricpossible]) {
            distinct.push(data[i]);
            unique[data[i].metricpossible] = 1;
          }
        }
      }

      return distinct;
    } // find unique metric value


    function createCompanyArray() {
      var unique = [];
      var distinct = [];

      for (var i = 0; i < data.length; i++) {
        if (data[i].company) {
          if (!unique[data[i].company]) {
            distinct.push(data[i]);
            unique[data[i].company] = 1;
          }
        }
      }

      for (var index = 0; index < distinct.length; index++) {
        distinct[index].color = legendBulletColor[index];
      }

      return distinct;
    } // find unique metric value


    function createUniqueMatricValue() {
      var unique = [];
      var distinct = [];

      for (var i = 0; i < data.length; i++) {
        if (data[i].metricvalue) {
          if (!unique[data[i].metricvalue]) {
            distinct.push(data[i]);
            unique[data[i].metricvalue] = 1;
          }
        }
      }

      return distinct;
    }

    var uniqueMatricValue = createUniqueMatricValue();
    var resultset = creatUniqueArray();
    var uniqueCompanies = createCompanyArray(); // set indicator color same as company color

    var getIndicatorColor = data => {
      var findMatricValue = uniqueMatricValue.filter(d => d.metricvalue === data.metricpossible);

      if (findMatricValue.length === 1) {
        return findMatricValue[0].color;
      } else if (findMatricValue.length === 2) {
        return findMatricValue[1].color;
      } else if (findMatricValue.length === 3) {
        return findMatricValue[2].color;
      } else {
        return '';
      }
    };

    var getIndicatorColorOne = data => {
      var matchingMatricValue = uniqueCompanies.filter(d => d.metricvalue === data.metricpossible);
      return matchingMatricValue.length === 2 ? matchingMatricValue[1].color : '';
    };

    var getIndicatorColorTwo = data => {
      var matchingMatricValue = uniqueMatricValue.filter(d => d.metricvalue === data.metricpossible);
      console.log('matchingMatricValue', matchingMatricValue);
      return matchingMatricValue.length === 3 ? matchingMatricValue[2].color : '';
    }; // draw indicator conditionally


    var getCompanyIndicator = data => {
      var matchingMatricValue = uniqueCompanies.filter(d => d.metricvalue === data.metricpossible);
      return matchingMatricValue.length > 0 ? matchingMatricValue[0] : {};
    };

    var getCompanyIndicatorOne = data => {
      var matchingMatricValue = uniqueCompanies.filter(d => d.metricvalue === data.metricpossible);
      return matchingMatricValue.length === 2 ? matchingMatricValue[1] : {};
    };

    var getCompanyIndicatorTwo = data => {
      var matchingMatricValue = uniqueCompanies.filter(d => d.metricvalue === data.metricpossible);
      return matchingMatricValue.length === 3 ? matchingMatricValue[2] : {};
    };

    var total = d3.sum(resultset, d => d.metricpossiblevalues);
    orderDesc ? resultset.sort((a, b) => a.orderby - b.orderby) : resultset.sort((a, b) => b.orderby - a.orderby); // const middleIndex = resultset.indexOf(resultset[Math.round((resultset.length - 1) / 2)]);

    var middle = resultset.length / 2 + (resultset.length % 2 === 0 ? 1 : resultset.length % 2);
    var middleIndex = parseInt(middle + '');

    var _data = groupData(resultset, total); //getPoints to draw ppolylines and flip according to x position to left/right


    var getPoints = (d, index) => {
      var polyLineHeight = 20;
      var polyLineWidth = 20;
      var pointFirstX = xScale(d.cumulative) + xScale(d.metricpossiblevalues) / 2 - 12;
      var pointFirstY = h / 2 - halfBarHeight * lineHeight + 5;
      var pointSecondX = 0;
      var pointSecondY = 0;
      var pointThirdX = 0;
      var pointThirdY = 0;

      if (pointFirstX <= w / 2) {
        pointSecondX = pointFirstX;
        pointSecondY = pointFirstY - polyLineHeight * (index + 1);
        pointThirdX = pointFirstX + polyLineWidth * (index + 1);
        pointThirdY = pointFirstY - polyLineHeight * (index + 1);
      } else {
        pointSecondX = pointFirstX;
        pointSecondY = pointFirstY - polyLineHeight * (index + 1);
        pointThirdX = pointFirstX - polyLineWidth * (index + 1);
        pointThirdY = pointFirstY - polyLineHeight * (index + 1);
      }

      return pointFirstX + " " + pointFirstY + " " + pointSecondX + " " + pointSecondY + " " + pointThirdX + " " + pointThirdY;
    }; //getPoints to draw text alignment


    var getTextAlignment = (d, index) => {
      var pointFirstX = xScale(d.cumulative) + xScale(d.metricpossiblevalues) / 2 - 12;
      var alignPos = '';

      if (pointFirstX < w / 2) {
        alignPos = 'start';
      } else {
        alignPos = 'end';
      }

      return alignPos;
    }; // find polyline endX position to place text at same X postion


    var getPolylineEndX = (d, index) => {
      var polylines = selection.selectAll('polyline') || null;
      var filterVal = polylines.filter((d, eleIndex) => index === eleIndex);
      var pointArr = filterVal[0][0].attributes[1].value.split(' ');
      var xCordinate = index < middleIndex ? pointArr[pointArr.length - 2] + 7 : pointArr[pointArr.length - 2] - 5;
      return xCordinate;
    }; // find polyline endY position to place text at same Y postion


    var getPolylineEndY = (d, index) => {
      var polyLineHeight = 20;
      var pointFirstY = h / 2 - halfBarHeight * lineHeight + 5;
      return pointFirstY - polyLineHeight * (index + 1);
    }; // set up scales for horizontal placement


    var xScale = d3Scale.scaleLinear().domain([0, total]).range([0, w]); // create svg in passed in div
    // d3.select('svg').remove();

    var selection = d3.select(svgRef.current).attr('width', w).attr('height', height).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'); // stack rect for each data value

    d3.selectAll('rect').remove();
    selection.selectAll('rect').data(_data).enter().append('rect').attr('class', 'rect-stacked').attr('x', d => xScale(d.cumulative) - 12).attr('y', h / 2 - halfBarHeight).attr('height', barHeight).attr('width', d => xScale(d.metricpossiblevalues)).style('fill', (d, i) => customColors[i + 4]).text(d => f(d.percent) < 5 ? f(d.percent) + '%, ' + ' ' + d.metricpossible : f(d.percent) + '%'); // add image on top of bar(indicator)

    d3.selectAll('.indicator-row-one').remove();
    selection.selectAll('.indicator-row-one').data(_data).enter().append('text').attr('class', 'indicator-row-one').attr('text-anchor', 'middle').attr('font-size', '14px').style('fill', (d, i) => getIndicatorColor(d)).attr('x', d => xScale(d.cumulative) + xScale(d.metricpossiblevalues) / 2 - 12).attr('y', (d, i) => h / 2 - halfBarHeight * 1.1).text(d => getCompanyIndicator(d).metricvalue === d.metricpossible ? '▼' : '');
    d3.selectAll('.indicator-row-two').remove();
    selection.selectAll('.indicator-row-two').data(_data).enter().append('text').attr('class', 'indicator-row-two').attr('text-anchor', 'middle').attr('font-size', '14px').style('fill', (d, i) => getIndicatorColorOne(d)).attr('x', d => xScale(d.cumulative) + xScale(d.metricpossiblevalues) / 2 - 12).attr('y', (d, i) => h / 2 - halfBarHeight * 1.4).text(d => getCompanyIndicatorOne(d).metricvalue === d.metricpossible ? '▼' : '');
    d3.selectAll('.indicator-row-three').remove();
    selection.selectAll('.indicator-row-three').data(_data).enter().append('text').attr('class', 'indicator-row-three').attr('text-anchor', 'middle').attr('font-size', '14px').style('fill', (d, i) => getIndicatorColorTwo(d)).attr('x', d => xScale(d.cumulative) + xScale(d.metricpossiblevalues) / 2 - 12).attr('y', (d, i) => h / 2 - halfBarHeight * 1.7).text(d => getCompanyIndicatorTwo(d).metricvalue === d.metricpossible ? '▼' : ''); // add some labels for percentages

    d3.selectAll('.text-percent').remove();
    selection.selectAll('.text-percent').data(_data).enter().append('text').attr('class', 'text-percent').attr('text-anchor', 'middle').attr('font-size', '11px').attr('x', d => xScale(d.cumulative) + xScale(d.metricpossiblevalues) / 2 - 12).attr('y', h / 2 - halfBarHeight / 2.5).text(d => f(d.percent) > 5 ? f(d.percent) + '%' : ''); // add the labels bellow bar

    d3.selectAll('.text-label').remove();
    selection.selectAll('.text-label').data(_data).enter().append('text').attr('class', 'text-label').attr('text-anchor', 'middle').attr('font-size', '9px').attr('x', d => xScale(d.cumulative) + xScale(d.metricpossiblevalues) / 2 - 12).attr('y', h / 2 + 15).style('fill', '#000').attr('width', d => xScale(d.metricpossiblevalues) / 3).text(d => f(d.percent) < 5 ? '' : d.metricpossible).call(getMetricPossible); // draw ppolylines

    d3.selectAll('polyline').remove();
    selection.selectAll('.polyline').data(_data).enter().append('polyline').style('stroke', 'black').style('fill', 'none').attr('stroke-width', 0.6).attr('points', (d, index) => f(d.percent) < 5 ? getPoints(d, index) : ''); // append text at the end of line

    d3.selectAll('.line-text').remove();
    selection.selectAll('.line-text').data(_data).enter().append('text').attr('class', 'line-text').attr('text-anchor', (d, index) => getTextAlignment(d, index)).attr('font-size', '11px').attr('x', (d, index) => isNaN(getPolylineEndX(d, index)) ? '' : getPolylineEndX(d, index)).attr('y', (d, index) => getPolylineEndY(d, index) + 2).text(d => f(d.percent) < 5 ? f(d.percent) + '%, ' + ' ' + d.metricpossible : ''); // Legends drawing

    var size = 10;
    d3.selectAll('legend-circle').remove();
    selection.selectAll('.legend-circle').data(uniqueCompanies).enter().append('rect').attr('x', width - 230).attr('y', (d, i) => height - 100 + i * (size + 5)) // 100 is where the first dot appears. 25 is the distance between dots
    .attr('width', size).attr('height', size).style('fill', (d, index) => d.color); // legend labels

    d3.selectAll('.legend-label').remove();
    selection.selectAll('.legend-label').data(uniqueCompanies).enter().append('text').attr('class', 'legend-label').attr('font-size', '11px').attr('x', width - 225 + size * 1.2).attr('y', (d, i) => height - 92 + i * (size + 6)) // 100 is where the first dot appears. 25 is the distance between dots
    .style('fill', (d, index) => d.color).text(d => d.company).attr('text-anchor', 'left');
  };

  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("svg", {
    ref: svgRef
  }));
}