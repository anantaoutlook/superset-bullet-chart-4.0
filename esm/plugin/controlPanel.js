function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
import setupColors from './colorSchemeRegistry';
import { t, getCategoricalSchemeRegistry } from '@superset-ui/core';
import { sections, sharedControls } from '@superset-ui/chart-controls';
setupColors();
var categoricalSchemeRegistry = getCategoricalSchemeRegistry();
var arrayUniqueByKey = [...new Map(categoricalSchemeRegistry.values().map(item => [item.id, item])).values()];
var sequentialUnique = [...new Map(categoricalSchemeRegistry.values().map(item => [item.id, item])).values()];
arrayUniqueByKey = arrayUniqueByKey.filter(sc => sc.id.startsWith('_'));
sequentialUnique = sequentialUnique.filter(sc => !sc.id.startsWith('_'));
console.log('bulletColors', sequentialUnique);
var config = {
  /**
   * The control panel is split into two tabs: "Query" and
   * "Chart Options". The controls that define the inputs to
   * the chart data request, such as columns and metrics, usually
   * reside within "Query", while controls that affect the visual
   * appearance or functionality of the chart are under the
   * "Chart Options" section.
   *
   * There are several predefined controls that can be used.
   * Some examples:
   * - groupby: columns to group by (tranlated to GROUP BY statement)
   * - series: same as groupby, but single selection.
   * - metrics: multiple metrics (translated to aggregate expression)
   * - metric: sane as metrics, but single selection
   * - adhoc_filters: filters (translated to WHERE or HAVING
   *   depending on filter type)
   * - row_limit: maximum number of rows (translated to LIMIT statement)
   *
   * If a control panel has both a `series` and `groupby` control, and
   * the user has chosen `col1` as the value for the `series` control,
   * and `col2` and `col3` as values for the `groupby` control,
   * the resulting query will contain three `groupby` columns. This is because
   * we considered `series` control a `groupby` query field and its value
   * will automatically append the `groupby` field when the query is generated.
   *
   * It is also possible to define custom controls by importing the
   * necessary dependencies and overriding the default parameters, which
   * can then be placed in the `controlSetRows` section
   * of the `Query` section instead of a predefined control.
   *
   * import { validateNonEmpty } from '@superset-ui/core';
   * import {
   *   sharedControls,
   *   ControlConfig,
   *   ControlPanelConfig,
   * } from '@superset-ui/chart-controls';
   *
   * const myControl: ControlConfig<'SelectControl'> = {
   *   name: 'secondary_entity',
   *   config: {
   *     ...sharedControls.entity,
   *     type: 'SelectControl',
   *     label: t('Secondary Entity'),
   *     mapStateToProps: state => ({
   *       sharedControls.columnChoices(state.datasource)
   *       .columns.filter(c => c.groupby)
   *     })
   *     validators: [validateNonEmpty],
   *   },
   * }
   *
   * In addition to the basic drop down control, there are several predefined
   * control types (can be set via the `type` property) that can be used. Some
   * commonly used examples:
   * - SelectControl: Dropdown to select single or multiple values,
       usually columns
   * - MetricsControl: Dropdown to select metrics, triggering a modal
       to define Metric details
   * - AdhocFilterControl: Control to choose filters
   * - CheckboxControl: A checkbox for choosing true/false values
   * - SliderControl: A slider with min/max values
   * - TextControl: Control for text data
   *
   * For more control input types, check out the `incubator-superset` repo
   * and open this file: superset-frontend/src/explore/components/controls/index.js
   *
   * To ensure all controls have been filled out correctly, the following
   * validators are provided
   * by the `@superset-ui/core/lib/validator`:
   * - validateNonEmpty: must have at least one value
   * - validateInteger: must be an integer value
   * - validateNumber: must be an intger or decimal value
   */
  // For control input types, see: superset-frontend/src/explore/components/controls/index.js
  controlPanelSections: [sections.legacyRegularTime, {
    label: t('Query'),
    expanded: true,
    controlSetRows: [[{
      name: 'cols',
      config: _extends({}, sharedControls.groupby, {
        label: t('Columns'),
        description: t('Columns to group by')
      })
    }], [{
      name: 'metrics',
      config: _extends({}, sharedControls.metrics)
    }], ['adhoc_filters'], [{
      name: 'row_limit',
      config: sharedControls.row_limit
    }]]
  }, {
    label: t('Hello Controls!'),
    expanded: true,
    controlSetRows: [[{
      name: 'header_text',
      config: {
        type: 'TextControl',
        default: 'Hello, World!',
        renderTrigger: true,
        // ^ this makes it apply instantaneously, without triggering a "run query" button
        label: t('Header Text'),
        description: t('The text you want to see in the header')
      }
    }], [{
      name: 'bold_text',
      config: {
        type: 'CheckboxControl',
        label: t('Bold Text'),
        renderTrigger: true,
        default: true,
        description: t('A checkbox to make the ')
      }
    }, {
      name: 'order_desc',
      config: {
        type: 'CheckboxControl',
        label: t('Sort descending'),
        renderTrigger: true,
        default: true,
        description: t('Whether to sort descending or ascending')
      }
    }], [{
      name: 'header_font_size',
      config: {
        type: 'SelectControl',
        label: t('Font Size'),
        default: 'xl',
        choices: [// [value, label]
        ['xxs', 'xx-small'], ['xs', 'x-small'], ['s', 'small'], ['m', 'medium'], ['l', 'large'], ['xl', 'x-large'], ['xxl', 'xx-large']],
        renderTrigger: true,
        description: t('The size of your header font')
      }
    }], [{
      name: 'color_scheme',
      config: {
        type: 'ColorSchemeControl',
        label: t('Linear color scheme'),
        choices: () => arrayUniqueByKey.map(value => [value.id, value.label]),
        default: '_pink',
        clearable: false,
        description: '',
        renderTrigger: true,
        schemes: () => categoricalSchemeRegistry.getMap(),
        isLinear: false
      }
    }], [{
      name: 'bullet_color_scheme',
      config: {
        type: 'ColorSchemeControl',
        label: t('Bullet Linear color scheme'),
        choices: () => sequentialUnique.map(value => [value.id, value.label]),
        default: 'bnbColors',
        clearable: true,
        description: '',
        renderTrigger: true,
        schemes: () => categoricalSchemeRegistry.getMap(),
        isLinear: false
      }
    }]]
  }]
};
export default config;