/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership. Camunda licenses this file to you under the Apache License,
 * Version 2.0; you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var template = require('./cam-esri-map-plugin.html?raw');

var angular = require('camunda-commons-ui/vendor/angular');

var DEFAULT_OPTIONS = {
  hideCompleteButton: false,
  hideLoadVariablesButton: false,
  disableCompleteButton: false,
  disableForm: false,
  disableAddVariableButton: false
};

var Controller = [
  '$scope',
  '$location',
  '$q',
  'camAPI',
  'assignNotification',
  function($scope, $location, $q, camAPI, assignNotification) {
    // setup ///////////////////////////////////////////////////////////
    $scope.loadingState = 'LOADING';

    //var Task = camAPI.resource('task');

    var errorHandler = $scope.errorHandler;

    $scope.options = angular.copy(DEFAULT_OPTIONS);

    //const esriMap = $scope.taskData.newChild($scope);

    // task form /////////////////////////////////////////////////////////////////////////

    function clearTask() {
      //console.log('clear');
    }

    // will be called when the form has been submitted
    $scope.completionCallback = function(err) {
      if (err) {
        return errorHandler('COMPLETE_ERROR', err);
      }

      if ($scope.task.processInstanceId) {
        assignNotification({
          assignee: $scope.task.assignee,
          processInstanceId: $scope.task.processInstanceId,
          maxResults: 15
        });
      } else if ($scope.task.caseInstanceId) {
        assignNotification({
          assignee: $scope.task.assignee,
          caseInstanceId: $scope.task.caseInstanceId,
          maxResults: 15
        });
      }

      clearTask();
    };
  }
];

var Configuration = function PluginConfiguration(ViewsProvider) {
  ViewsProvider.registerDefaultView('tasklist.task.action', {
    id: 'esri-map-plugin',
    label: 'esrimap',
    template: template,
    controller: Controller,
    priority: 1000
  });
};

Configuration.$inject = ['ViewsProvider'];

module.exports = Configuration;
