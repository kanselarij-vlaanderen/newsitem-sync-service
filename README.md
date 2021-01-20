# newsitem-sync-service

The Kaleidos application automatically generates a news-item (`besluitvorming:NieuwsbriefInfo`) for the agenda-items (`besluit:Agendapunt`) of type 'announcement' (`ext:wordtGetoondAlsMededeling` = true).
If afterwards the title or content of an agenda-item is updated, the title and content of the news-item should be updated as well.
This service synchronises the news-item title and content whenever the agenda-item title or content is updated.

## Configuration
All configuration is hard-coded in `config.js`.

Use following snippet in delta-notifier config:
```js
{
    match: {
        predicate: {
        type: 'uri',
        value: 'http://purl.org/dc/terms/title'
        }
    },
    callback: {
        url: 'http://newsitem-sync/delta',
        method: 'POST'
    },
    options: {
        resourceFormat: 'v0.0.1',
        gracePeriod: 250,
        ignoreFromSelf: true
    }
},
{
    match: {
        predicate: {
        type: 'uri',
        value: 'http://purl.org/dc/terms/alternative'
        }
    },
    callback: {
        url: 'http://newsitem-sync/delta',
        method: 'POST'
    },
    options: {
        resourceFormat: 'v0.0.1',
        gracePeriod: 250,
        ignoreFromSelf: true
    }
}
```

## Available endpoints

#### POST /delta

Internal endpoint for receiving deltas from the [delta-notifier](https://github.com/mu-semtech/delta-notifier)