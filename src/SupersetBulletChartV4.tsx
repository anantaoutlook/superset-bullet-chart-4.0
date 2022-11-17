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
 import { Superset2CustomChartBulletProps } from './types';
 import * as d3 from 'd3';
 import * as d3Scale from 'd3-scale';
 
 const categorialSchemeRegistry = getCategoricalSchemeRegistry();
 // The following Styles component is a <div> element, which has been styled using Emotion
 // For docs, visit https://emotion.sh/docs/styled
 
 // Theming variables are provided for your use via a ThemeProvider
 // imported from @superset-ui/core. For variables available, please visit
 // https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts
 
 /* const Styles = styled.div<Superset2CustomChartBulletStylesProps>`
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
 
 export default function Superset2CustomChartBullet(
   props: Superset2CustomChartBulletProps,
 ) {
   // height and width are the height and width of the DOM element as it exists in the dashboard.
   // There is also a `data` prop, which is, of course, your DATA 🎉
   const {
     data,
     height,
     colorScheme,
     width,
     orderDesc,
     bulletColorScheme,
   } = props;
 
   const svgRef = createRef<SVGSVGElement>();
 
   // Often, you just want to get a hold of the DOM and go nuts.
   // Here, you can do that with createRef, and the useEffect hook.
   useEffect(() => {
     render(svgRef);
   }, [props, orderDesc, colorScheme, bulletColorScheme]);
 
   const render = (svgRef: any) => {
     // custom colors theme
     let customColors: string[];
     const colorsValues = categorialSchemeRegistry.values();
     const filterColors: any = colorsValues.filter(
       (c: any) => c.id === colorScheme,
     );
     const findLegendColorScheme: any = colorsValues.filter(
       (c: any) => c.id === bulletColorScheme,
     );
 
     if (filterColors[0]) {
       customColors = [...filterColors[0].colors];
     }
 
     let legendBulletColor: Array<string> = [];
     if (findLegendColorScheme[0]) {
       legendBulletColor = [...findLegendColorScheme[0].colors];
     }
 
     const groupData = (data: any, total: any) => {
       let cumulative = 0;
       const _data = data
         .map((d: any) => {
           cumulative += d.metricpossiblevalues;
           return {
             metricpossiblevalues: d.metricpossiblevalues,
             cumulative: cumulative - d.metricpossiblevalues,
             metricvalue: d.metricvalue,
             company: d.company,
             metricpossible: d.metricpossible,
             percent: ((d.metricpossiblevalues / total) * 100).toFixed(2),
           };
         })
         .filter((d: any) => d.metricpossiblevalues > 0);
       return _data;
     };
 
     const config: any = {
       f: d3.format('.1f'),
       margin: { top: 20, right: 10, bottom: 20, left: 10 },
       barHeight: 40,
     };
     const { f, margin, barHeight } = config;
     const w = width - margin.left - margin.right;
     const h = height - margin.top - margin.bottom;
     const halfBarHeight = barHeight;
     const lineHeight = 1.1;
 
     //
     const getMetricPossible = (data: any) => {
       const rectangles: any = selection.selectAll('rect') || null;
       data.each(function (this: any) {
         const filterVal = rectangles[0].filter(
           (d: any, eleIndex: number) => data[0].indexOf(this) === eleIndex,
         );
         if (filterVal.length > 0) {
           wrap(this, parseFloat(filterVal[0].attributes[4].value) + 5);
         }
       });
     };
 
     // wrap text
     const wrap = (txt: any, data: any) => {
       const width = data;
       const text = d3.select(txt);
       const words = text.text().split(/\s+/).reverse();
       let word;
       let line: any = [];
       let lineNumber = 0;
       const lineHeight = 1.1; // ems
       const x = text.attr('x');
       const y = text.attr('y');
       const dy = parseFloat(text.attr('dy')) || 0;
       let tspan: any = text
         .text(null)
         .append('tspan')
         .attr('x', x)
         .attr('y', y)
         .attr('dy', dy + 'em');
 
       while ((word = words.pop())) {
         line.push(word);
         tspan.text(line.join(' '));
         const tspanWidth = tspan.node().getComputedTextLength() + 1;
         if (tspanWidth > width) {
           line.pop();
           tspan.text(line.join(' '));
           line = [word];
           tspan = text
             .append('tspan')
             .attr('x', x)
             .attr('y', y)
             .attr('dy', ++lineNumber * lineHeight + dy + 'em')
             .text(word);
         }
       }
     };
 
     // find unique metric value
     function creatUniqueArray() {
       const unique = [];
       const distinct = [];
       // const result = [];
       for (let i = 0; i < data.length; i++) {
         if (data[i].metricpossible) {
           if (!unique[data[i].metricpossible]) {
             distinct.push(data[i]);
             unique[data[i].metricpossible] = 1;
           }
         }
       }
       return distinct;
     }
     // find unique metric value
     function createCompanyArray() {
       const unique = [];
       const distinct = [];
       for (let i = 0; i < data.length; i++) {
         if (data[i].company) {
           if (!unique[data[i].company]) {
             distinct.push(data[i]);
             unique[data[i].company] = 1;
           }
         }
       }
       for (let index = 0; index < distinct.length; index++) {
         distinct[index].color = legendBulletColor[index];
       }
       return distinct;
     }
 
     // find unique metric value
     function createUniqueMatricValue() {
       const unique = [];
       const distinct = [];
       for (let i = 0; i < data.length; i++) {
         if (data[i].metricvalue) {
           if (!unique[data[i].metricvalue]) {
             distinct.push(data[i]);
             unique[data[i].metricvalue] = 1;
           }
         }
       }
       return distinct;
     }
     const uniqueMatricValue = createUniqueMatricValue();
 
     const resultset = creatUniqueArray();
     const uniqueCompanies = createCompanyArray();
 
     // set indicator color same as company color
     const getIndicatorColor = (data: any) => {
       const findMatricValue = uniqueMatricValue.filter(
         (d: any) => d.metricvalue === data.metricpossible,
       );
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
 
     const getIndicatorColorOne = (data: any) => {
       const matchingMatricValue = uniqueCompanies.filter(
         (d: any) => d.metricvalue === data.metricpossible,
       );
       return matchingMatricValue.length === 2
         ? matchingMatricValue[1].color
         : '';
     };
 
     const getIndicatorColorTwo = (data: any) => {
       const matchingMatricValue = uniqueMatricValue.filter(
         (d: any) => d.metricvalue === data.metricpossible,
       );
       console.log('matchingMatricValue', matchingMatricValue);
       return matchingMatricValue.length === 3
         ? matchingMatricValue[2].color
         : '';
     };
 
     // draw indicator conditionally
     const getCompanyIndicator = (data: any) => {
       const matchingMatricValue = uniqueCompanies.filter(
         (d: any) => d.metricvalue === data.metricpossible,
       );
       return matchingMatricValue.length > 0 ? matchingMatricValue[0] : {};
     };
     const getCompanyIndicatorOne = (data: any) => {
       const matchingMatricValue = uniqueCompanies.filter(
         (d: any) => d.metricvalue === data.metricpossible,
       );
       return matchingMatricValue.length === 2 ? matchingMatricValue[1] : {};
     };
     const getCompanyIndicatorTwo = (data: any) => {
       const matchingMatricValue = uniqueCompanies.filter(
         (d: any) => d.metricvalue === data.metricpossible,
       );
       return matchingMatricValue.length === 3 ? matchingMatricValue[2] : {};
     };
 
     const total = d3.sum(resultset, (d: any) => d.metricpossiblevalues);
     orderDesc
       ? resultset.sort((a: any, b: any) => a.orderby - b.orderby)
       : resultset.sort((a: any, b: any) => b.orderby - a.orderby);
 
     // const middleIndex = resultset.indexOf(resultset[Math.round((resultset.length - 1) / 2)]);
     const middle =
       resultset.length / 2 +
       (resultset.length % 2 === 0 ? 1 : resultset.length % 2);
     const middleIndex: any = parseInt(middle + '');
     const _data = groupData(resultset, total);
 
     //getPoints to draw ppolylines and flip according to x position to left/right
     const getPoints = (d: any, index: any) => {
       const polyLineHeight = 20;
       const polyLineWidth = 20;
       const pointFirstX =
         xScale(d.cumulative)! + xScale(d.metricpossiblevalues)! / 2 - 12;
       const pointFirstY = h / 2 - halfBarHeight * lineHeight + 5;
       let pointSecondX = 0;
       let pointSecondY = 0;
       let pointThirdX = 0;
       let pointThirdY = 0;
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
       return `${pointFirstX} ${pointFirstY} ${pointSecondX} ${pointSecondY} ${pointThirdX} ${pointThirdY}`;
     };
 
     //getPoints to draw text alignment
     const getTextAlignment = (d: any, index: any) => {
       const pointFirstX =
         xScale(d.cumulative)! + xScale(d.metricpossiblevalues)! / 2 - 12;
       let alignPos = '';
       if (pointFirstX < w / 2) {
         alignPos = 'start';
       } else {
         alignPos = 'end';
       }
       return alignPos;
     };
 
     // find polyline endX position to place text at same X postion
     const getPolylineEndX = (d: any, index: any) => {
       const polylines: any = selection.selectAll('polyline') || null;
       const filterVal = polylines.filter(
         (d: any, eleIndex: number) => index === eleIndex,
       );
       const pointArr = filterVal[0][0].attributes[1].value.split(' ');
       const xCordinate =
         index < middleIndex
           ? pointArr[pointArr.length - 2] + 7
           : pointArr[pointArr.length - 2] - 5;
       return xCordinate;
     };
 
     // find polyline endY position to place text at same Y postion
     const getPolylineEndY = (d: any, index: any) => {
       const polyLineHeight = 20;
       const pointFirstY = h / 2 - halfBarHeight * lineHeight + 5;
       return pointFirstY - polyLineHeight * (index + 1);
     };
 
     // set up scales for horizontal placement
     const xScale = d3Scale.scaleLinear().domain([0, total]).range([0, w]);
 
     // create svg in passed in div
     // d3.select('svg').remove();
     const selection = d3
       .select(svgRef.current)
       .attr('width', w)
       .attr('height', height)
       .append('g')
       .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
 
     // stack rect for each data value
     d3.selectAll('rect').remove();
     selection
       .selectAll('rect')
       .data(_data)
       .enter()
       .append('rect')
       .attr('class', 'rect-stacked')
       .attr('x', (d: any) => xScale(d.cumulative)! - 12)
       .attr('y', h / 2 - halfBarHeight)
       .attr('height', barHeight)
       .attr('width', (d: any) => xScale(d.metricpossiblevalues)!)
       .style('fill', (d, i) => customColors[i + 4])
       .text((d: any) =>
         f(d.percent) < 5
           ? f(d.percent) + '%, ' + ' ' + d.metricpossible
           : f(d.percent) + '%',
       );
 
     // add image on top of bar(indicator)
     d3.selectAll('.indicator-row-one').remove();
     selection
       .selectAll('.indicator-row-one')
       .data(_data)
       .enter()
       .append('text')
       .attr('class', 'indicator-row-one')
       .attr('text-anchor', 'middle')
       .attr('font-size', '14px')
       .style('fill', (d: any, i) => getIndicatorColor(d))
       .attr(
         'x',
         (d: any) =>
           xScale(d.cumulative)! + xScale(d.metricpossiblevalues)! / 2 - 12,
       )
       .attr('y', (d: any, i) => h / 2 - halfBarHeight * 1.1)
       .text((d: any) =>
         getCompanyIndicator(d).metricvalue === d.metricpossible ? '▼' : '',
       );
 
     d3.selectAll('.indicator-row-two').remove();
     selection
       .selectAll('.indicator-row-two')
       .data(_data)
       .enter()
       .append('text')
       .attr('class', 'indicator-row-two')
       .attr('text-anchor', 'middle')
       .attr('font-size', '14px')
       .style('fill', (d: any, i) => getIndicatorColorOne(d))
       .attr(
         'x',
         (d: any) =>
           xScale(d.cumulative)! + xScale(d.metricpossiblevalues)! / 2 - 12,
       )
       .attr('y', (d: any, i) => h / 2 - halfBarHeight * 1.4)
       .text((d: any) =>
         getCompanyIndicatorOne(d).metricvalue === d.metricpossible ? '▼' : '',
       );
 
     d3.selectAll('.indicator-row-three').remove();
     selection
       .selectAll('.indicator-row-three')
       .data(_data)
       .enter()
       .append('text')
       .attr('class', 'indicator-row-three')
       .attr('text-anchor', 'middle')
       .attr('font-size', '14px')
       .style('fill', (d: any, i) => getIndicatorColorTwo(d))
       .attr(
         'x',
         (d: any) =>
           xScale(d.cumulative)! + xScale(d.metricpossiblevalues)! / 2 - 12,
       )
       .attr('y', (d: any, i) => h / 2 - halfBarHeight * 1.7)
       .text((d: any) =>
         getCompanyIndicatorTwo(d).metricvalue === d.metricpossible ? '▼' : '',
       );
 
     // add some labels for percentages
     d3.selectAll('.text-percent').remove();
     selection
       .selectAll('.text-percent')
       .data(_data)
       .enter()
       .append('text')
       .attr('class', 'text-percent')
       .attr('text-anchor', 'middle')
       .attr('font-size', '11px')
       .attr(
         'x',
         (d: any) =>
           xScale(d.cumulative)! + xScale(d.metricpossiblevalues)! / 2 - 12,
       )
       .attr('y', h / 2 - halfBarHeight / 2.5)
       .text((d: any) => (f(d.percent) > 5 ? f(d.percent) + '%' : ''));
 
     // add the labels bellow bar
     d3.selectAll('.text-label').remove();
     selection
       .selectAll('.text-label')
       .data(_data)
       .enter()
       .append('text')
       .attr('class', 'text-label')
       .attr('text-anchor', 'middle')
       .attr('font-size', '9px')
       .attr(
         'x',
         (d: any) =>
           xScale(d.cumulative)! + xScale(d.metricpossiblevalues)! / 2 - 12,
       )
       .attr('y', h / 2 + 15)
       .style('fill', '#000')
       .attr('width', (d: any) => xScale(d.metricpossiblevalues)! / 3)
       .text((d: any) => (f(d.percent) < 5 ? '' : d.metricpossible))
       .call(getMetricPossible);
 
     // draw ppolylines
     d3.selectAll('polyline').remove();
     selection
       .selectAll('.polyline')
       .data(_data)
       .enter()
       .append('polyline')
       .style('stroke', 'black')
       .style('fill', 'none')
       .attr('stroke-width', 0.6)
       .attr('points', (d: any, index: any) =>
         f(d.percent) < 5 ? getPoints(d, index) : '',
       );
 
     // append text at the end of line
     d3.selectAll('.line-text').remove();
     selection
       .selectAll('.line-text')
       .data(_data)
       .enter()
       .append('text')
       .attr('class', 'line-text')
       .attr('text-anchor', (d: any, index: any) => getTextAlignment(d, index))
       .attr('font-size', '11px')
       .attr('x', (d: any, index: any) =>
         isNaN(getPolylineEndX(d, index)) ? '' : getPolylineEndX(d, index),
       )
       .attr('y', (d: any, index: any) => getPolylineEndY(d, index) + 2)
       .text((d: any) =>
         f(d.percent) < 5 ? f(d.percent) + '%, ' + ' ' + d.metricpossible : '',
       );
 
     // Legends drawing
     const size = 10;
     d3.selectAll('legend-circle').remove();
     selection
       .selectAll('.legend-circle')
       .data(uniqueCompanies)
       .enter()
       .append('rect')
       .attr('x', width - 230)
       .attr('y', (d: any, i: any) => height - 100 + i * (size + 5)) // 100 is where the first dot appears. 25 is the distance between dots
       .attr('width', size)
       .attr('height', size)
       .style('fill', (d: any, index: any) => d.color);
 
     // legend labels
     d3.selectAll('.legend-label').remove();
     selection
       .selectAll('.legend-label')
       .data(uniqueCompanies)
       .enter()
       .append('text')
       .attr('class', 'legend-label')
       .attr('font-size', '11px')
       .attr('x', width - 225 + size * 1.2)
       .attr('y', (d: any, i: any) => height - 92 + i * (size + 6)) // 100 is where the first dot appears. 25 is the distance between dots
       .style('fill', (d: any, index: any) => d.color)
       .text((d: any) => d.company)
       .attr('text-anchor', 'left');
   };
 
   return (
     <div>
       <svg ref={svgRef}></svg>
     </div>
   );
 }
 