define([
  './datasource',
],
function (TemplatingJsonDatasource) {
  'use strict';

  function configView() {
    return {templateUrl: 'public/plugins/templating_json/partials/config.html'};
  }

  return {
    Datasource: TemplatingJsonDatasource,
    configView: configView
  };
});
