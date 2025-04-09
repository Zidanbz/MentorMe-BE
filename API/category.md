
# categories

## Create Categories New

#### Endpoint : POST /api/categories/new

#### Request Body

```json
{
  "name": "Bisnis"
}
```

#### Response Body (Success)

```json
{
  "code": 200,
  "error": null,
  "data": [
    {
      "id": "UUID",
      "name": "Desain"
    },
    {
      "id": "UUID",
      "name": "Bisnis"
    }
  ],
  "message": "httpStatusMessage",
  "time": "second-minute-jam data-month-year",
  "UUID": "5832532n9gwe80"
}
```

#### Response Body (Failed)

```json
{
  "code": 403,
  "error": "Message Error ?",
  "data": null,
  "message": "httpStatusMessage",
  "time": "second-minute-jam data-month-year",
  "UUID": "5832532n9gwe80"
}
```

## Get categories

@ID is id from categories
#### Endpoint : GET /api/categories

#### Request Body

```json
{
}
```

#### Response Body (Success)

```json
{
  "code": 200,
  "error": null,
  "data": [
    {
      "id": "UUID",
      "name": "Pemrograman Web"
    },
    {
      "id": "UUID",
      "name": "Pengolahan Data"
    },
    {
      "id": "UUID",
      "name": "Pengenalan Desain"
    }
  ],
  "message": "httpStatusMessage",
  "time": "second-minute-jam data-month-year",
  "UUID": "5832532n9gwe80"
}
```

#### Response Body (Failed)

```json
{
  "code": 403,
  "error": "Message Error ?",
  "data": null,
  "message": "httpStatusMessage",
  "time": "second-minute-jam data-month-year",
  "UUID": "5832532n9gwe80"
}
```