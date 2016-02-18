define([
  './datasource',
],
function (TemplatingJsonDatasource) {
  'use strict';

  var TemplatingJsonConfigCtrl = function() {};
  TemplatingJsonConfigCtrl.templateUrl = 'partials/config.html';

  return {
    Datasource: TemplatingJsonDatasource,
    ConfigCtrl: TemplatingJsonConfigCtrl
  };
});
