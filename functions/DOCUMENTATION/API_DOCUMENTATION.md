# MentorMe API Documentation

## Overview

MentorMe adalah platform pembelajaran online yang menghubungkan mentor dan siswa. API ini dibangun menggunakan Node.js, Express.js, dan Firebase Functions dengan Firestore sebagai database.

**Base URL:** `https://asia-southeast2-mentorme-aaa37.cloudfunctions.net/widgets22`

## Authentication

API menggunakan Firebase Authentication dengan JWT tokens. Setiap endpoint yang memerlukan autentikasi akan mencantumkan role yang diizinkan.

### Roles:

- `USER`: Siswa/pengguna biasa
- `MENTOR`: Mentor/pengajar
- `ADMIN`: Administrator sistem

## Response Format

Semua response menggunakan format standar:

```json
{
  "code": 200,
  "error": null,
  "data": {},
  "message": "Success",
  "time": "2024-01-01T00:00:00.000Z",
  "idRequest": "uuid-string"
}
```

---

## 1. Authentication & Registration

### 1.1 Login User

**Endpoint:** `POST /api/login/user`
**Description:** Login untuk semua jenis user (USER, MENTOR, ADMIN)
**Authorization:** None

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "fcmToken": "firebase-fcm-token" // Optional untuk push notification
}
```

**Response Success (200):**

```json
{
  "code": 200,
  "data": {
    "token": "jwt-token",
    "user": {
      "uid": "user-id",
      "email": "user@example.com",
      "fullName": "User Name",
      "role": "USER",
      "phone": "+628123456789",
      "picture": "profile-picture-url"
    }
  },
  "message": "Login successful"
}
```

### 1.2 Register User

**Endpoint:** `POST /api/registration/user`
**Description:** Registrasi user baru
**Authorization:** None

**Request Body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+628123456789",
  "picture": "profile-picture-url" // Optional
}
```

### 1.3 Register Mentor

**Endpoint:** `POST /api/registration/mentor`
**Description:** Registrasi mentor baru
**Authorization:** None
**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**

- `fullName`: string
- `email`: string
- `password`: string
- `phone`: string
- `expertise`: string
- `experience`: string
- `cv`: file (PDF)
- `certificate`: file (PDF)
- `picture`: file (Image)

### 1.4 Register Admin

**Endpoint:** `POST /api/registration/admin`
**Description:** Registrasi admin baru
**Authorization:** None

---

## 2. User Profile Management

### 2.1 Get User Profile

**Endpoint:** `GET /api/profile/get`
**Description:** Mendapatkan profil user yang sedang login
**Authorization:** `USER`

**Response:**

```json
{
  "code": 200,
  "data": {
    "uid": "user-id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+628123456789",
    "picture": "profile-picture-url",
    "coin": 1000
  }
}
```

### 2.2 Edit User Profile

**Endpoint:** `PUT /api/profile/edit`
**Description:** Edit profil user
**Authorization:** `USER`
**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**

- `fullName`: string (optional)
- `phone`: string (optional)
- `picture`: file (optional)

### 2.3 Get Mentor Profile

**Endpoint:** `GET /api/profile/mentor`
**Description:** Mendapatkan profil mentor yang sedang login
**Authorization:** `MENTOR`

### 2.4 Update Mentor Profile

**Endpoint:** `PATCH /api/profile/mentor/update`
**Description:** Update profil mentor
**Authorization:** `MENTOR`

---

## 3. Category Management

### 3.1 Get All Categories

**Endpoint:** `GET /api/categories`
**Description:** Mendapatkan semua kategori pembelajaran
**Authorization:** `USER`, `MENTOR`, `ADMIN`

**Response:**

```json
{
  "code": 200,
  "data": [
    {
      "id": "category-id",
      "name": "Programming",
      "description": "Learn programming languages",
      "picture": "category-image-url"
    }
  ]
}
```

### 3.2 Create Category

**Endpoint:** `POST /api/categories/new`
**Description:** Membuat kategori baru
**Authorization:** `ADMIN`
**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**

- `name`: string
- `description`: string
- `picture`: file

---

## 4. Learning Path Management

### 4.1 Create Learning Path

**Endpoint:** `POST /api/learn/new`
**Description:** Membuat learning path baru
**Authorization:** `ADMIN`
**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**

- `name`: string
- `description`: string
- `categoryId`: string
- `picture`: file

### 4.2 Get Learning Paths by Category

**Endpoint:** `GET /api/learn/categories/:id`
**Description:** Mendapatkan learning path berdasarkan kategori
**Authorization:** `USER`, `MENTOR`

**Parameters:**

- `id`: Category ID

### 4.3 Get All Learning Paths

**Endpoint:** `GET /api/all/learnpath`
**Description:** Mendapatkan semua learning path
**Authorization:** `USER`, `MENTOR`

### 4.4 Get Projects in Learning Path

**Endpoint:** `GET /api/learn/:id`
**Description:** Mendapatkan semua project dalam learning path
**Authorization:** `USER`

**Parameters:**

- `id`: Learning Path ID

### 4.5 Search Projects in Learning Path

**Endpoint:** `GET /api/learn/project/search/:id`
**Description:** Mencari project dalam learning path
**Authorization:** `USER`

**Parameters:**

- `id`: Learning Path ID

**Query Parameters:**

- `search`: string

---

## 5. Project Management

### 5.1 Create Project

**Endpoint:** `POST /api/project/new`
**Description:** Membuat project baru (oleh mentor)
**Authorization:** `MENTOR`
**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**

- `materialName`: string
- `info`: string
- `price`: number
- `coinFree`: number
- `learningPathId`: string
- `learningMethod`: string
- `linkVideo`: string (optional)
- `picture`: file

### 5.2 Get Project Detail

**Endpoint:** `GET /api/learn/project/:id`
**Description:** Mendapatkan detail project
**Authorization:** `USER`, `MENTOR`

**Parameters:**

- `id`: Project ID

### 5.3 Update Project

**Endpoint:** `PUT /api/project/update/:id`
**Description:** Update project
**Authorization:** `MENTOR`

**Parameters:**

- `id`: Project ID

### 5.4 Delete Project

**Endpoint:** `DELETE /api/project/delete/:id`
**Description:** Hapus project
**Authorization:** `MENTOR`

**Parameters:**

- `id`: Project ID

### 5.5 Get All Projects

**Endpoint:** `GET /api/project/all`
**Description:** Mendapatkan semua project
**Authorization:** None

### 5.6 Get Pending Projects (Admin)

**Endpoint:** `GET /api/project/pending`
**Description:** Mendapatkan project yang menunggu approval
**Authorization:** `ADMIN`

### 5.7 Accept Project

**Endpoint:** `PUT /api/project/accepted/:id`
**Description:** Approve project
**Authorization:** `ADMIN`

**Parameters:**

- `id`: Project ID

**Request Body:**

```json
{
  "reason": "Project approved",
  "email": "mentor@example.com"
}
```

### 5.8 Get Accepted Projects (Mentor)

**Endpoint:** `GET /api/project/accepted`
**Description:** Mendapatkan project yang sudah diapprove untuk mentor
**Authorization:** `MENTOR`

### 5.9 Get Rejected Projects (Admin)

**Endpoint:** `GET /api/project/reject`
**Description:** Mendapatkan project yang ditolak
**Authorization:** `ADMIN`

### 5.10 Get Pending Projects by Mentor

**Endpoint:** `GET /api/pending/mentor`
**Description:** Mendapatkan project pending milik mentor
**Authorization:** `MENTOR`

### 5.11 Get Rejected Projects by Mentor

**Endpoint:** `GET /api/reject/mentor`
**Description:** Mendapatkan project yang ditolak milik mentor
**Authorization:** `MENTOR`

---

## 6. Transaction & Payment

### 6.1 Create Payment Transaction

**Endpoint:** `POST /api/payment/:id`
**Description:** Membuat transaksi pembayaran untuk project
**Authorization:** `USER`

**Parameters:**

- `id`: Project ID

**Request Body:**

```json
{
  "voucherId": "voucher-id" // Optional
}
```

### 6.2 Get Pre-Transaction Data

**Endpoint:** `GET /api/pay/:id`
**Description:** Mendapatkan data sebelum transaksi
**Authorization:** `USER`

**Parameters:**

- `id`: Project ID

### 6.3 Payment Notification (Webhook)

**Endpoint:** `POST /notification`
**Description:** Webhook untuk notifikasi pembayaran dari Midtrans
**Authorization:** None

### 6.4 Get Transaction History

**Endpoint:** `GET /api/profile/history`
**Description:** Mendapatkan riwayat transaksi user
**Authorization:** `USER`

### 6.5 Coin to Money Conversion (Mentor)

**Endpoint:** `POST /api/change/coin`
**Description:** Konversi coin ke uang untuk mentor
**Authorization:** `MENTOR`

**Request Body:**

```json
{
  "amount": 1000,
  "bankAccount": "1234567890",
  "bankName": "BCA"
}
```

### 6.6 Money Withdrawal (Mentor)

**Endpoint:** `POST /api/change/money`
**Description:** Penarikan uang untuk mentor
**Authorization:** `MENTOR`

### 6.7 Get Mentor Transaction History

**Endpoint:** `GET /api/history/transaction/mentor`
**Description:** Riwayat transaksi mentor
**Authorization:** `MENTOR`

### 6.8 Get All Transactions (Admin)

**Endpoint:** `GET /api/admin/history/transaction`
**Description:** Semua transaksi untuk admin
**Authorization:** `ADMIN`

### 6.9 Update Withdrawal Status (Admin)

**Endpoint:** `PUT /api/admin/withdrawal/status/:id`
**Description:** Update status penarikan
**Authorization:** `ADMIN`

**Parameters:**

- `id`: Withdrawal ID

**Request Body:**

```json
{
  "status": "APPROVED" // or "REJECTED"
}
```

---

## 7. Top Up & Coin Management

### 7.1 Create Top Up Transaction

**Endpoint:** `POST /api/coin/topUp`
**Description:** Membuat transaksi top up coin
**Authorization:** `USER`

**Request Body:**

```json
{
  "amount": 50000 // Amount in IDR
}
```

### 7.2 Top Up Notification (Webhook)

**Endpoint:** `POST /api/topup/notification`
**Description:** Webhook notifikasi top up dari Midtrans
**Authorization:** None

### 7.3 Get Top Up History

**Endpoint:** `GET /api/coin/get`
**Description:** Riwayat top up coin
**Authorization:** `USER`

---

## 8. Learning Management

### 8.1 Get My Learning

**Endpoint:** `GET /api/my/learning`
**Description:** Mendapatkan pembelajaran yang diikuti user
**Authorization:** `USER`

### 8.2 Get All Learning (Admin)

**Endpoint:** `GET /api/admin/learning`
**Description:** Semua pembelajaran untuk admin
**Authorization:** `ADMIN`

### 8.3 Get Purchased Projects (Mentor)

**Endpoint:** `GET /api/project/buy`
**Description:** Project yang dibeli dari mentor
**Authorization:** `MENTOR`

### 8.4 Get All Purchased Projects (Admin)

**Endpoint:** `GET /api/admin/project/buy`
**Description:** Semua project yang dibeli
**Authorization:** `ADMIN`

### 8.5 Get Completed Projects (Mentor)

**Endpoint:** `GET /api/project/completed`
**Description:** Project yang sudah diselesaikan
**Authorization:** `MENTOR`

### 8.6 Complete Learning

**Endpoint:** `POST /api/learning/:id/complete`
**Description:** Menyelesaikan pembelajaran
**Authorization:** `USER`

**Parameters:**

- `id`: Learning ID

---

## 9. Syllabus Management

### 9.1 Create Syllabus

**Endpoint:** `POST /api/syllabus/new/:id`
**Description:** Membuat silabus untuk project
**Authorization:** `MENTOR`

**Parameters:**

- `id`: Project ID

**Request Body:**

```json
{
  "title": "Introduction to Programming",
  "description": "Basic programming concepts",
  "duration": "2 hours",
  "materials": ["Variables", "Functions", "Loops"]
}
```

### 9.2 Get Syllabus by Project

**Endpoint:** `GET /api/syllabus/:id`
**Description:** Mendapatkan silabus berdasarkan project
**Authorization:** `MENTOR`

**Parameters:**

- `id`: Project ID

### 9.3 Get Syllabus Detail

**Endpoint:** `GET /api/syllabus/detail/:id`
**Description:** Detail silabus
**Authorization:** `MENTOR`

**Parameters:**

- `id`: Syllabus ID

### 9.4 Update Syllabus

**Endpoint:** `PUT /api/syllabus/update/:id`
**Description:** Update silabus
**Authorization:** `MENTOR`

**Parameters:**

- `id`: Syllabus ID

---

## 10. Activity Management

### 10.1 Get My Activity

**Endpoint:** `GET /api/my/activity/:id`
**Description:** Mendapatkan aktivitas pembelajaran
**Authorization:** `USER`, `MENTOR`, `ADMIN`

**Parameters:**

- `id`: Learning/Project ID

### 10.2 Upload Activity

**Endpoint:** `POST /api/my/activity/upload/:id`
**Description:** Upload aktivitas pembelajaran
**Authorization:** `USER`
**Content-Type:** `multipart/form-data`

**Parameters:**

- `id`: Learning ID

**Request Body (Form Data):**

- `title`: string
- `description`: string
- `file`: file (document/image)

### 10.3 Get Activity for Report

**Endpoint:** `GET /api/activity/:id`
**Description:** Mendapatkan aktivitas untuk laporan
**Authorization:** `MENTOR`, `ADMIN`

**Parameters:**

- `id`: Activity ID

### 10.4 Create Report

**Endpoint:** `PUT /api/report/:id`
**Description:** Membuat laporan aktivitas
**Authorization:** `MENTOR`

**Parameters:**

- `id`: Activity ID

**Request Body:**

```json
{
  "feedback": "Good progress",
  "score": 85,
  "notes": "Keep up the good work"
}
```

---

## 11. Review Management

### 11.1 Create Review

**Endpoint:** `POST /api/task/:id`
**Description:** Membuat review untuk project
**Authorization:** `USER`

**Parameters:**

- `id`: Project ID

**Request Body:**

```json
{
  "rating": 5,
  "comment": "Excellent course!",
  "mentorId": "mentor-id"
}
```

---

## 12. Voucher Management

### 12.1 Create Voucher

**Endpoint:** `POST /api/voucher/created`
**Description:** Membuat voucher baru
**Authorization:** `ADMIN`

**Request Body:**

```json
{
  "code": "DISCOUNT50",
  "discount": 50,
  "discountType": "PERCENTAGE", // or "FIXED"
  "minPurchase": 100000,
  "maxDiscount": 25000,
  "validUntil": "2024-12-31T23:59:59.000Z",
  "usageLimit": 100
}
```

### 12.2 Get Active Vouchers

**Endpoint:** `GET /api/voucher/get`
**Description:** Mendapatkan voucher yang aktif
**Authorization:** `USER`, `ADMIN`

### 12.3 Delete Voucher

**Endpoint:** `DELETE /api/voucher/delete/:id`
**Description:** Hapus voucher
**Authorization:** `ADMIN`

**Parameters:**

- `id`: Voucher ID

### 12.4 Update Voucher

**Endpoint:** `PUT /api/voucher/edit/:id`
**Description:** Update voucher
**Authorization:** `ADMIN`

**Parameters:**

- `id`: Voucher ID

---

## 13. Chat & Consultation

### 13.1 Save Chat Message

**Endpoint:** `POST /api/chat`
**Description:** Menyimpan pesan chat
**Authorization:** `USER`, `MENTOR`, `ADMIN`

**Request Body:**

```json
{
  "receiverId": "user-id",
  "message": "Hello, how can I help you?",
  "consultationId": "consultation-id" // Optional
}
```

### 13.2 Get Chat Messages

**Endpoint:** `GET /api/chat`
**Description:** Mendapatkan pesan chat
**Authorization:** `USER`, `MENTOR`, `ADMIN`

**Query Parameters:**

- `consultationId`: string (optional)
- `receiverId`: string (optional)

### 13.3 Create Consultation

**Endpoint:** `POST /api/consultation/create`
**Description:** Membuat konsultasi baru
**Authorization:** `USER`
**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**

- `title`: string
- `description`: string
- `category`: string
- `materialFile`: file (optional)

### 13.4 Get Available Consultations

**Endpoint:** `GET /api/consultation/available`
**Description:** Mendapatkan konsultasi yang tersedia untuk mentor
**Authorization:** `MENTOR`

### 13.5 Accept Consultation

**Endpoint:** `POST /api/consultation/:consultationId/accept`
**Description:** Menerima konsultasi
**Authorization:** `MENTOR`

**Parameters:**

- `consultationId`: Consultation ID

### 13.6 Reject Consultation

**Endpoint:** `POST /api/consultation/:consultationId/reject`
**Description:** Menolak konsultasi
**Authorization:** `MENTOR`

**Parameters:**

- `consultationId`: Consultation ID

### 13.7 Complete Consultation

**Endpoint:** `POST /api/consultation/:consultationId/complete`
**Description:** Menyelesaikan konsultasi
**Authorization:** `MENTOR`

**Parameters:**

- `consultationId`: Consultation ID

### 13.8 Get Consultation Messages

**Endpoint:** `GET /api/consultation/:consultationId/messages`
**Description:** Mendapatkan pesan dalam konsultasi
**Authorization:** `USER`, `MENTOR`

**Parameters:**

- `consultationId`: Consultation ID

---

## 14. Notification Management

### 14.1 Create Notification

**Endpoint:** `POST /api/notif/new`
**Description:** Membuat notifikasi baru
**Authorization:** `ADMIN`

**Request Body:**

```json
{
  "title": "New Feature Available",
  "message": "Check out our new learning feature!",
  "targetRole": "USER", // or "MENTOR", "ALL"
  "type": "INFO" // or "WARNING", "SUCCESS"
}
```

### 14.2 Get All Notifications

**Endpoint:** `GET /api/notif/all`
**Description:** Mendapatkan semua notifikasi
**Authorization:** None

---

## 15. Admin Management

### 15.1 Get Pending Mentors

**Endpoint:** `GET /api/mentor/pending`
**Description:** Mendapatkan mentor yang menunggu approval
**Authorization:** `ADMIN`

### 15.2 Accept Mentor

**Endpoint:** `PUT /api/accepted`
**Description:** Approve mentor
**Authorization:** `ADMIN`

**Request Body:**

```json
{
  "email": "mentor@example.com",
  "reason": "Mentor approved"
}
```

### 15.3 Get Rejected Mentors

**Endpoint:** `GET /api/user/reject`
**Description:** Mendapatkan mentor yang ditolak
**Authorization:** `ADMIN`

---

## Error Codes

| Code | Description           |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 500  | Internal Server Error |

## Common Error Responses

### 401 Unauthorized

```json
{
  "code": 401,
  "error": "Token not provided or invalid",
  "data": null,
  "message": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "code": 403,
  "error": "Insufficient permissions",
  "data": null,
  "message": "Access denied"
}
```

### 404 Not Found

```json
{
  "code": 404,
  "error": "Resource not found",
  "data": null,
  "message": "Not Found"
}
```

### 500 Internal Server Error

```json
{
  "code": 500,
  "error": "Internal server error occurred",
  "data": null,
  "message": "Internal Server Error"
}
```

---

## Data Models

### User Model

```json
{
  "uid": "string",
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "picture": "string",
  "role": "USER|MENTOR|ADMIN",
  "coin": "number",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Project Model

```json
{
  "ID": "string",
  "materialName": "string",
  "info": "string",
  "price": "number",
  "coinFree": "number",
  "picture": "string",
  "linkVideo": "string",
  "learningPath": "string",
  "mentor": "string",
  "status": "PENDING|APPROVED|REJECTED",
  "learningMethod": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Transaction Model

```json
{
  "id": "string",
  "userId": "string",
  "projectId": "string",
  "amount": "number",
  "status": "PENDING|SUCCESS|FAILED",
  "paymentMethod": "string",
  "transactionId": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

## File Upload Guidelines

### Supported File Types:

- **Images**: JPG, JPEG, PNG (max 5MB)
- **Documents**: PDF (max 10MB)
- **Videos**: MP4 (max 100MB)

### Upload Endpoints:

- Profile pictures: `/api/profile/edit`
- Project materials: `/api/project/new`
- Activity files: `/api/my/activity/upload/:id`
- Mentor documents: `/api/registration/mentor`

---

## Rate Limiting

- **General endpoints**: 100 requests per minute per IP
- **Authentication endpoints**: 10 requests per minute per IP
- **File upload endpoints**: 20 requests per minute per user

---

## Changelog

### Version 1.0.0 (Current)

- Initial API release
- Basic CRUD operations for all entities
- Authentication and authorization
- File upload support
- Payment integration with Midtrans
- Real-time chat functionality
- Push notification support

---

## Support

For technical support or questions about this API, please contact:

- Email: support@mentorme.com
- Documentation: [API Docs](https://mentorme.com/api-docs)
