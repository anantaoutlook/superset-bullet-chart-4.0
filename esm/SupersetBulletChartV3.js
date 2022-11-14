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
import React, { useEffect, useState, createRef } from 'react';
import { getCategoricalSchemeRegistry } from '@superset-ui/core';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
var categorialSchemeRegistry = getCategoricalSchemeRegistry(); // The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled
// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

/* const Styles = styled.div<SupersetBulletChartV3StylesProps>`
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

export default function SupersetBulletChartV3(props) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  var {
    data,
    height,
    colorScheme,
    width,
    orderDesc
  } = props;
  console.log('props', props); // console.log('props', props);

  var totals = 0; // custom colors theme

  var customColors;
  var svgRef = /*#__PURE__*/createRef();
  var colorsValues = categorialSchemeRegistry.values(); // console.log('colorsValues', colorsValues);
  // console.log('colorScheme', colorScheme);

  var filterColors = colorsValues.filter(c => c.id === colorScheme); // console.log('filterColors', filterColors);

  if (filterColors[0]) {
    customColors = [...filterColors[0].colors];
  } // let selectedOption = "chart";


  var onSiteChanged = (type, value) => {
    setType({
      selectedOption: value,
      totals: totals
    });
  };

  var [form, setType] = useState({
    selectedOption: 'chart',
    totals: 0
  }); // Often, you just want to get a hold of the DOM and go nuts.
  // Here, you can do that with createRef, and the useEffect hook.

  useEffect(() => {
    render(svgRef); // setType({ selectedOption: 'chart' , totals: totals});
  }, [props, form, setType, orderDesc]);

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

  var render = svgRef => {
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
    var lineHeight = 1.1;
    var legendBulletColor = ['#ff5a5f', '#7b0051', '#007A87', '#00d1c1', '#8ce071', '#ffb400', '#b4a76c', '#ff8083', '#cc0086', '#00a1b3', '#00ffeb', '#bbedab', '#ffd266', '#cbc29a', '#ff3339', '#ff1ab1', '#005c66', '#00b3a5', '#55d12e', '#b37e00', '#988b4e']; //

    var getMetricPossible = data => {
      var rectangles = selection.selectAll('rect') || null;
      data.each(function () {
        var filterVal = rectangles[0].filter((d, eleIndex) => data[0].indexOf(this) === eleIndex);

        if (filterVal.length > 0) {
          wrap(this, parseFloat(filterVal[0].attributes[4].value) + 5);
        }
      });
    };

    var wrap = (txt, data) => {
      var width = data;
      var text = d3.select(txt);
      var words = text.text().split(/\s+/).reverse();
      var word;
      var line = [];
      var lineNumber = 0;
      var lineHeight = 1.1; // ems

      var x = text.attr("x");
      var y = text.attr("y");
      var dy = parseFloat(text.attr("dy")) || 0;
      var tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        var tspanWidth = tspan.node().getComputedTextLength() + 1;

        if (tspanWidth > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    };

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
    }

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
    }

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
    console.log('uniqueMatricValue', uniqueMatricValue);
    var resultset = creatUniqueArray();
    var uniqueCompanies = createCompanyArray();
    /* const mergeCompanyColor = () => {
     for (let uniqueCompanyindex = 0; uniqueCompanyindex < uniqueCompanies.length; uniqueCompanyindex++) {
      for (let iniqueMatricIndex = 0; iniqueMatricIndex < uniqueMatricValue.length; iniqueMatricIndex++) {
        uniqueCompanies[uniqueCompanyindex].metricvalue === uniqueMatricValue[iniqueMatricIndex].metricvalue ? uniqueCompanies[uniqueCompanyindex].color : uniqueCompanies[uniqueCompanyindex].color;
      }
     }
    }
    mergeCompanyColor(); */

    var getIndicatorColor = data => {
      var findMatricValue = uniqueMatricValue.filter(d => d.metricvalue === data.metricvalue);
      return findMatricValue.length > 0 ? findMatricValue[0].color : '';
    };

    console.log('uniqueCompanies', uniqueCompanies);

    var getCompanyIndicator = data => {
      var matchingMatricValue = uniqueCompanies.filter(d => d.metricvalue === data.metricpossible);
      return matchingMatricValue.length > 0 ? matchingMatricValue[0] : {};
    };

    var total = d3.sum(resultset, d => d.metricpossiblevalues);
    totals = total;
    orderDesc ? resultset.sort((a, b) => a.orderby - b.orderby) : resultset.sort((a, b) => b.orderby - a.orderby); // const middleIndex = resultset.indexOf(resultset[Math.round((resultset.length - 1) / 2)]);

    var middle = resultset.length / 2 + (resultset.length % 2 === 0 ? 1 : resultset.length % 2);
    var middleIndex = parseInt(middle + '');

    var _data = groupData(resultset, total); //getPoints to draw ppolylines


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
    }; // get text position
    //getPoints to draw polylines


    var getTextAlignment = (d, index) => {
      var pointFirstX = xScale(d.cumulative) + xScale(d.metricpossiblevalues) / 2 - 12;
      var alignPos = '';

      if (pointFirstX < w / 2) {
        alignPos = 'start';
      } else {
        alignPos = 'end';
      }

      return alignPos;
    };

    var getPolylineEndX = (d, index) => {
      var polylines = selection.selectAll('polyline') || null;
      var filterVal = polylines.filter((d, eleIndex) => index === eleIndex);
      var pointArr = filterVal[0][0].attributes[1].value.split(' ');
      var xCordinate = index < middleIndex ? pointArr[pointArr.length - 2] + 7 : pointArr[pointArr.length - 2] - 5;
      return xCordinate;
    };

    var getPolylineEndY = (d, index) => {
      var polyLineHeight = 20;
      var pointFirstY = h / 2 - halfBarHeight * lineHeight + 5;
      return pointFirstY - polyLineHeight * (index + 1);
    }; // set up scales for horizontal placement


    var xScale = d3Scale.scaleLinear().domain([0, total]).range([0, w]); // create svg in passed in div
    // d3.select('svg').remove();

    var selection = d3.select(svgRef.current) // .append('svg')
    .attr('width', w).attr('height', height).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'); // stack rect for each data value

    d3.selectAll('rect').remove();
    selection.selectAll('rect').data(_data).enter().append('rect').attr('class', 'rect-stacked').attr('x', d => xScale(d.cumulative) - 12).attr('y', h / 2 - halfBarHeight).attr('height', barHeight).attr('width', d => xScale(d.metricpossiblevalues)).style('fill', (d, i) => customColors[i + 4]).text(d => f(d.percent) < 5 ? f(d.percent) + '%, ' + ' ' + d.metricpossible : f(d.percent) + '%'); // add image on top of bar(indicator)

    d3.selectAll('.text-value').remove();
    selection.selectAll('.text-value').data(_data).enter().append('text').attr('class', 'text-value').attr('text-anchor', 'middle').attr('font-size', '14px') // .style('fill', (d: any, i) => d.color)
    .style('fill', (d, i) => getIndicatorColor(d)) // .style('fill', (d, i) => legendBulletColor[checkCompanyExist(d, i)])
    // .style('fill', (d, i) => customColors[customColors.length - 3])
    .attr('x', d => xScale(d.cumulative) + xScale(d.metricpossiblevalues) / 2 - 12).attr('y', h / 2 - halfBarHeight * 1.1).text(d => getCompanyIndicator(d).metricvalue === d.metricpossible ? '▼' : ''); // add some labels for percentages

    d3.selectAll('.text-percent').remove();
    selection.selectAll('.text-percent').data(_data).enter().append('text').attr('class', 'text-percent').attr('text-anchor', 'middle').attr('font-size', '11px').attr('x', d => xScale(d.cumulative) + xScale(d.metricpossiblevalues) / 2 - 12).attr('y', h / 2 - halfBarHeight / 2.5).text(d => f(d.percent) > 5 ? f(d.percent) + '%' : ''); // add the labels bellow bar

    d3.selectAll('.text-label').remove();
    selection.selectAll('.text-label').data(_data).enter().append('text').attr('class', 'text-label') //  .attr('text-anchor', (d:any)=> f(d.percent) < 5 ? 'end' :'middle')
    .attr('text-anchor', 'middle').attr('font-size', '9px').attr('x', d => xScale(d.cumulative) + xScale(d.metricpossiblevalues) / 2 - 12).attr('y', h / 2 + 15).style('fill', '#000').attr('width', d => xScale(d.metricpossiblevalues) / 3).text(d => f(d.percent) < 5 ? '' : d.metricpossible).call(getMetricPossible); // .style('fill', (d, i) => customColors[i])
    // draw ppolylines

    d3.selectAll('polyline').remove();
    selection.selectAll('.polyline').data(_data).enter().append('polyline').style('stroke', 'black').style('fill', 'none').attr('stroke-width', 0.6).attr('points', (d, index) => f(d.percent) < 5 ? getPoints(d, index) : ''); // .attr('points', (d: any, index: any) =>  getPoints(d, index));
    // append text at the end of line

    d3.selectAll('.line-text').remove();
    selection.selectAll('.line-text').data(_data).enter().append('text').attr('class', 'line-text') // .attr('text-anchor', (d: any, index: any) => index < middleIndex ? 'start' : 'midddle')
    .attr('text-anchor', (d, index) => getTextAlignment(d, index)).attr('font-size', '11px').attr('x', (d, index) => isNaN(getPolylineEndX(d, index)) ? '' : getPolylineEndX(d, index)).attr('y', (d, index) => getPolylineEndY(d, index) + 2).text(d => f(d.percent) < 5 ? f(d.percent) + '%, ' + ' ' + d.metricpossible : ''); // Legend drawing
    // Add one dot in the legend for each name.

    var size = 10;
    d3.selectAll('legend-circle').remove();
    selection.selectAll(".legend-circle").data(uniqueCompanies).enter().append("rect").attr("x", width - 230).attr("y", (d, i) => height - 80 + i * (size + 5)) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size).attr("height", size).style("fill", (d, index) => d.color); // Add one dot in the legend for each name.

    d3.selectAll('.legend-label').remove();
    selection.selectAll(".legend-label").data(uniqueCompanies).enter().append("text").attr('class', 'legend-label').attr('font-size', '11px').attr("x", width - 225 + size * 1.2).attr("y", (d, i) => height - 72 + i * (size + 6)) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", (d, index) => d.color) // .text((d: any) => d.company + ':' + d.metricvalue)
    .text(d => d.company).attr("text-anchor", "left");
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    id: "chart",
    value: "chart",
    name: "optionGroup",
    checked: form.selectedOption === 'chart',
    onClick: e => onSiteChanged('', "chart")
  }), " ", /*#__PURE__*/React.createElement("label", {
    htmlFor: "chart",
    style: {
      verticalAlign: 'middle'
    }
  }, "chart one")), form.selectedOption === "chart" ? /*#__PURE__*/React.createElement("svg", {
    ref: svgRef
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: height + "px",
      fontSize: '10em',
      fontWeight: 'bold'
    }
  }, form.totals));
}