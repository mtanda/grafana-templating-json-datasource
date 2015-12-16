define([
  'angular',
  'lodash',
  'public/plugins/templating_json/bower_components/jmespath.js/jmespath.js',
],
function (angular, _) {
  'use strict';

  var module = angular.module('grafana.services');

  module.factory('TemplatingJsonDatasource', function($q, backendSrv, templateSrv) {
    function TemplatingJsonDatasource(datasource) {
      this.type = 'templating_json';
      this.name = datasource.name;
      this.url = datasource.url;
      this.basicAuth = datasource.basicAuth;
      this.withCredentials = datasource.withCredentials;
    }

    TemplatingJsonDatasource.prototype._request = function(method, url) {
      var options = {
        url: url,
        method: method
      };

      if (this.basicAuth || this.withCredentials) {
        options.withCredentials = true;
      }
      if (this.basicAuth) {
        options.headers = {
          "Authorization": this.basicAuth
        };
      }

      return backendSrv.datasourceRequest(options);
    };

    TemplatingJsonDatasource.prototype.metricFindQuery = function(query) {
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

    TemplatingJsonDatasource.prototype.testDatasource = function() {
      return this._request('GET', this.url).then(function() {
        return { status: 'success', message: 'Data source is working', title: 'Success' };
      });
    };

    return TemplatingJsonDatasource;
  });
});
