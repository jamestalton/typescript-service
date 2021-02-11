# Routes

| Method | Route             | Description |
| -----: | ----------------- | ----------- |
|    GET | /data/:collection |

### GET /data/:store

```json
{
    "type": "collection",
    "name": ""
}
```

### GET /data/:store/books

```json
[
    { "book": 1, "rev": 1 }
    { "book": 2, "rev": 1 }
    { "book": 3, "rev": 1 }
]
```

### GET /data/:store/pages/:book/:rev

```json
[
    { "page": 1, "rev": 1 }
    { "page": 2, "rev": 1 }
    { "page": 3, "rev": 1 }
]
```

### GET /data/:store/pages

```json
[
    { "page": 1, "rev": 1 }
    { "page": 2, "rev": 1 }
    { "page": 3, "rev": 1 }
]
```

### GET /data/:store/pages/:page/:rev

```json
[
    { "id": "1", "rev": 1 }
    { "id": "2", "rev": 1 }
    { "id": "3", "rev": 1 }
]
```

# GET /data/:store/items/:item/:rev/:metadata

```json
{
    "name": "",
    "labels": ["",""]
}
```

# GET /data/:store/items/:item/:rev/:data

```json
{
}
```
