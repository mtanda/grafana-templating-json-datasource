define([
  'angular',
  'lodash',
  'plugins/templating_json/bower_components/jmespath.js/jmespath.js',
  'app/plugins/sdk',
],
function (angular, _, jmespath) {
  'use strict';

  /** @ngInject */
  function TemplatingJsonDatasource(instanceSettings, $q, backendSrv, templateSrv) {
    this.type = instanceSettings.type;
    this.name = instanceSettings.name;
    this.url = instanceSettings.url;
    this.basicAuth = instanceSettings.basicAuth;
    this.withCredentials = instanceSettings.withCredentials;
    this.supportMetrics = true;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
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
        'Authorization': this.basicAuth
      };
    }

    return this.backendSrv.datasourceRequest(options);
  };

  TemplatingJsonDatasource.prototype.metricFindQuery = function(query) {
    if (!query) { return this.q.when([]); }

    try {
      query = this.templateSrv.replace(query);
    } catch (err) {
      return this.q.reject(err);
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
