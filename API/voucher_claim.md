# Voucher Claim API Documentation

## Claim Voucher

#### Endpoint : POST /api/voucher/claim/{voucherId}

#### Description : User can claim an available voucher

#### Request Parameters :

- `voucherId` (path parameter) : ID of the voucher to claim

#### Request Headers :

```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Request Body :

```json
{}
```

#### Response Body (Success):

```json
{
  "code": 201,
  "error": null,
  "data": {
    "message": "Voucher claimed successfully",
    "voucher": {
      "ID": "a746dd73-1f1e-4e38-891a-b03e56a77e55",
      "name": "voucher apa",
      "piece": 75,
      "info": "voucher ini adalah ...",
      "claimedAt": "2024-12-09T10:30:00.000Z"
    }
  },
  "message": "Created",
  "time": "second-minute-jam data-month-year"
}
```

#### Response Body (Failed):

```json
{
  "code": 400,
  "error": "You have already claimed this voucher",
  "data": null,
  "message": "Bad Request",
  "time": "second-minute-jam data-month-year"
}
```

## Get My Claimed Vouchers

#### Endpoint : GET /api/voucher/my-vouchers

#### Description : Get all vouchers claimed by the user

#### Request Headers :

```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Request Body :

```json
{}
```

#### Response Body (Success):

```json
{
  "code": 200,
  "error": null,
  "data": [
    {
      "userVoucherId": "user-voucher-id-1",
      "voucherId": "a746dd73-1f1e-4e38-891a-b03e56a77e55",
      "name": "voucher apa",
      "piece": 75,
      "info": "voucher ini adalah ...",
      "dateStart": "2024-12-09T00:00:00.000Z",
      "dateEnd": "2024-12-18T00:00:00.000Z",
      "claimedAt": "2024-12-09T10:30:00.000Z",
      "isUsed": false,
      "usedAt": null,
      "status": true
    }
  ],
  "message": "OK",
  "time": "second-minute-jam data-month-year"
}
```

## Get My Available Vouchers for Payment

#### Endpoint : GET /api/voucher/my-available

#### Description : Get vouchers that user has claimed and can be used for payment (not used and not expired)

#### Request Headers :

```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Request Body :

```json
{}
```

#### Response Body (Success):

```json
{
  "code": 200,
  "error": null,
  "data": [
    {
      "userVoucherId": "user-voucher-id-1",
      "voucherId": "a746dd73-1f1e-4e38-891a-b03e56a77e55",
      "name": "voucher apa",
      "piece": 75,
      "info": "voucher ini adalah ...",
      "dateStart": "2024-12-09T00:00:00.000Z",
      "dateEnd": "2024-12-18T00:00:00.000Z",
      "claimedAt": "2024-12-09T10:30:00.000Z",
      "isUsed": false,
      "usedAt": null,
      "status": true
    }
  ],
  "message": "OK",
  "time": "second-minute-jam data-month-year"
}
```

## Claim Voucher by Code (NEW)

#### Endpoint : POST /api/voucher/claim-by-code

#### Description : User can claim a voucher using unique voucher code

#### Request Headers :

```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Request Body :

```json
{
  "voucherCode": "SUMMER25"
}
```

#### Response Body (Success):

```json
{
  "code": 201,
  "error": null,
  "data": {
    "message": "Voucher berhasil diklaim!",
    "voucher": {
      "userVoucherId": "user-voucher-id-1",
      "voucherId": "a746dd73-1f1e-4e38-891a-b03e56a77e55",
      "name": "Summer Sale",
      "piece": 25,
      "info": "25% discount on all courses",
      "claimedAt": "2024-12-09T10:30:00.000Z",
      "status": "AVAILABLE"
    }
  },
  "message": "Created",
  "time": "second-minute-jam data-month-year"
}
```

#### Response Body (Failed - Invalid Code):

```json
{
  "code": 400,
  "error": "Voucher code \"INVALID\" tidak ditemukan",
  "data": null,
  "message": "Bad Request",
  "time": "second-minute-jam data-month-year"
}
```

#### Response Body (Failed - Expired):

```json
{
  "code": 400,
  "error": "Voucher sudah expired",
  "data": null,
  "message": "Bad Request",
  "time": "second-minute-jam data-month-year"
}
```

#### Response Body (Failed - Max Claims Reached):

```json
{
  "code": 400,
  "error": "Voucher sudah mencapai batas maksimal penggunaan",
  "data": null,
  "message": "Bad Request",
  "time": "second-minute-jam data-month-year"
}
```

#### Response Body (Failed - Already Claimed):

```json
{
  "code": 400,
  "error": "Anda sudah pernah mengklaim voucher ini",
  "data": null,
  "message": "Bad Request",
  "time": "second-minute-jam data-month-year"
}
```

## Get Available Vouchers to Claim

#### Endpoint : GET /api/voucher/available-to-claim

#### Description : Get vouchers that are available for user to claim (active vouchers that user hasn't claimed yet)

#### Request Headers :

```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Request Body :

```json
{}
```

#### Response Body (Success):

```json
{
  "code": 200,
  "error": null,
  "data": [
    {
      "ID": "44813b82-9131-4bea-a7c0-0913f0c4e391",
      "name": "voucher baru",
      "piece": 50,
      "info": "voucher diskon 50%",
      "dateStart": "2024-12-09T00:00:00.000Z",
      "dateEnd": "2024-12-25T00:00:00.000Z",
      "voucherCode": "SUMMER25",
      "maxClaims": 100,
      "currentClaims": 45
    }
  ],
  "message": "OK",
  "time": "second-minute-jam data-month-year"
}
```

## Error Responses

#### Voucher Not Found:

```json
{
  "code": 400,
  "error": "Voucher not found",
  "data": null,
  "message": "Bad Request",
  "time": "second-minute-jam data-month-year"
}
```

#### Voucher Expired:

```json
{
  "code": 400,
  "error": "Voucher has expired",
  "data": null,
  "message": "Bad Request",
  "time": "second-minute-jam data-month-year"
}
```

#### Voucher Already Claimed:

```json
{
  "code": 400,
  "error": "You have already claimed this voucher",
  "data": null,
  "message": "Bad Request",
  "time": "second-minute-jam data-month-year"
}
```

#### Voucher Not Available for Payment:

```json
{
  "code": 400,
  "error": "Voucher not found in your claimed vouchers or already used",
  "data": null,
  "message": "Bad Request",
  "time": "second-minute-jam data-month-year"
}
```

## Voucher Code System (NEW)

### Code Format Rules:

- **Length**: 3-20 characters
- **Characters**: Letters, numbers, underscore (\_), dash (-)
- **Case**: Case-insensitive (converted to uppercase)
- **Uniqueness**: Each code must be unique across all vouchers

### Code Generation Pattern:

```
{PREFIX}{TIMESTAMP}{RANDOM}
```

Example: `SAVE123456ABCD`

- PREFIX: "SAVE" (customizable)
- TIMESTAMP: Last 6 digits of timestamp
- RANDOM: 4 random uppercase alphanumeric characters

### Admin Voucher Creation (Updated):

When creating vouchers, admins can now include optional voucher code fields:

```json
{
  "name": "Summer Sale",
  "piece": 25,
  "startTime": 0,
  "endTime": 30,
  "info": "25% discount on all courses",
  "voucherCode": "SUMMER25",
  "maxClaims": 100
}
```

## Business Rules

1. **Claim Rules (by ID):**

   - User can only claim active vouchers
   - User cannot claim the same voucher twice
   - Expired vouchers cannot be claimed

2. **Claim Rules (by Code - NEW):**

   - User must provide valid voucher code format
   - Voucher code must exist in database
   - User can only claim active vouchers
   - User cannot claim the same voucher twice
   - Expired vouchers cannot be claimed
   - Voucher must not exceed maximum claims limit (if set)

3. **Usage Rules:**

   - Only claimed vouchers can be used in payment
   - Used vouchers cannot be used again
   - Expired vouchers cannot be used even if claimed

4. **Status Flow:**
   - Available → Claimed → Used
   - Claimed vouchers can expire if not used before end date

## Testing Examples

### Test Claim by Code with cURL:

```bash
# Successful claim
curl -X POST "https://widgets22-catb7yz54a-et.a.run.app/api/voucher/claim-by-code" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"voucherCode": "SUMMER25"}'

# Invalid code
curl -X POST "https://widgets22-catb7yz54a-et.a.run.app/api/voucher/claim-by-code" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"voucherCode": "INVALID"}'

# Missing code
curl -X POST "https://widgets22-catb7yz54a-et.a.run.app/api/voucher/claim-by-code" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Frontend Integration (Dart/Flutter):

```dart
// Claim voucher by code
final response = await PaymentProvider().claimVoucherByCode("SUMMER25");

if (response['success'] == true) {
  print("Voucher claimed: ${response['data']['voucher']['name']}");
} else {
  print("Error: ${response['message']}");
}
```
