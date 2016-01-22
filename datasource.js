define([
  'angular',
  'lodash',
  'plugins/templating_json/bower_components/jmespath.js/jmespath.js',
],
function (angular, _, jmespath) {
  'use strict';

  /** @ngInject */
  function TemplatingJsonDatasource(instanceSettings, $q, backendSrv, templateSrv) {

    this.type = 'templating_json';
    this.name = instanceSettings.name;
    this.url = instanceSettings.url;
    this.basicAuth = instanceSettings.basicAuth;
    this.withCredentials = instanceSettings.withCredentials;

    this._request = function(method, url) {
      var options = {
        url: url,
        method: method
      };

      if (this.basicAuth || this.withCredentials) {
        options.withCredentials = true;
      }
      if (this.basicAuth) {
        options.headers = {
          'Authorization': this.basicAuth
        };
      }

      return backendSrv.datasourceRequest(options);
    };

    this.metricFindQuery = function(query) {
      if (!query) { return $q.when([]); }

      try {
        query = templateSrv.replace(query);
      } catch (err) {
        return $q.reject(err);
      }

      return this._request('GET', this.url).then(function(response) {
        var result = jmespath.search(response.data, query);

        if (_.isString(result)) {
          return [{ text: result }];
        } else if (_.isArray(result)) {
          return _.map(result, function(r) { return { text: r }; });
        } else {
          throw new Error('invalid data');
        }
      });
    };

    this.testDatasource = function() {
      return this._request('GET', this.url).then(function() {
        return { status: 'success', message: 'Data source is working', title: 'Success' };
      });
    };
  }

  return TemplatingJsonDatasource;
});
