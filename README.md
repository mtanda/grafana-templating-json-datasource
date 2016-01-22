# Setup
Clone this repository somewhere.
And, edit your grafana.ini config file and add this:

```ini
[plugin.templating_json]
path = /home/your/clone/dir/datasource-plugin-templating_json
```

# How to use
1. Add datasource with JSON url, you want to query
2. Add templating query in dashboard, set jmespath query

# Sample query
If JSON is like following, and specify query like `foo.bar`, result is `baz` and `qux`.
```json
{
  "foo": {
    "bar": [
      "baz",
      "qux"
    ]
  }
}
```
