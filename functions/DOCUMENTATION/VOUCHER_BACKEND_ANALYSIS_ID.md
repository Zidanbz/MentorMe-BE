# Analisis Fitur Voucher (Backend MentorMe)

Dokumen ini menjelaskan arsitektur, alur bisnis, model data, endpoint API, validasi, integrasi transaksi, serta rekomendasi peningkatan untuk fitur voucher pada sisi Backend (BE) MentorMe. Sumber analisis diambil dari kode pada folder `MentorMe-BE/functions`.

## Ringkasan Fitur

Fitur voucher memungkinkan:
- Admin membuat, mengubah, dan menghapus voucher promosi diskon.
- User mengklaim voucher (berdasarkan ID atau kode), melihat daftar voucher yang dimiliki/tersedia, dan menggunakan voucher pada transaksi.
- Sistem menjaga konsistensi status voucher user (AVAILABLE/CLAIMED/USED/EXPIRED), membatasi klaim (global per user), serta menangani auto-expire voucher.

Entitas utama:
- Koleksi `vouchers`: definisi voucher yang tersedia (periode, persentase diskon, status aktif, batas klaim).
- Koleksi `user_vouchers`: relasi voucher yang diklaim user, status penggunaan, dan histori.

Komponen utama:
- Router: `functions/routes/VoucherRouter.js`
- Repositori: `public/javascripts/repo/VoucherRepo.js`, `public/javascripts/repo/UserVoucherRepo.js`
- Services (logika bisnis): direktori `public/javascripts/service/voucher/*`
- Integrasi ke transaksi: `public/javascripts/service/transaction/TransactionService.js`
- Security: `authorizeRole`, `verifyFirebaseToken`

## Arsitektur & Komponen

### Router
File: `functions/routes/VoucherRouter.js`
- Endpoints (dengan otorisasi):
  - ADMIN:
    - `POST /api/voucher/created`
    - `DELETE /api/voucher/delete/:id`
    - `PUT /api/voucher/edit/:id`
  - USER/ADMIN:
    - `GET /api/voucher/get` (list voucher aktif)
  - USER:
    - `POST /api/voucher/claim/:voucherId` (klaim by ID)
    - `POST /api/voucher/claim-by-code` (klaim by code)
    - `GET /api/voucher/my-vouchers` (voucher yang dimiliki user)
    - `GET /api/voucher/my-available` (voucher user yang dapat dipakai untuk pembayaran)
    - `GET /api/voucher/available-to-claim` (voucher aktif yang belum diklaim user)

Security:
- `authorizeRole("USER" | "ADMIN")`
- `verifyFirebaseToken` untuk validasi token user (dipakai di claim-by-code)

### Repositori

1) VoucherRepo (`public/javascripts/repo/VoucherRepo.js`)
- `createNewVoucher(data)`: simpan dokumen ke koleksi `vouchers`.
- `getVoucherActive()`: ambil voucher `status==true`, cek expiry berdasarkan `dateEnd`; bila sudah lewat waktu, update `status=false`. Mengembalikan hanya voucher yang masih aktif.
- `deleteVoucher(voucherId)`: hapus dokumen berdasarkan `ID`.
- `getVoucherById(voucherId)`: ambil berdasarkan `ID`.
- `updateVoucher(id, data)`: update field voucher (name, piece, dateStart, dateEnd, status, info).
- `getVoucherByCode(voucherCode)`: ambil voucher aktif berdasarkan `voucherCode` (limit 1).
- `updateVoucherClaimCount(voucherId, newClaimCount)`: update `currentClaims` pada voucher.
- `checkVoucherCodeExists(voucherCode)`: cek eksistensi kode (limit 1).

2) UserVoucherRepo (`public/javascripts/repo/UserVoucherRepo.js`)
- Enum status:
  - `AVAILABLE`, `USED`, `EXPIRED`, `CLAIMED`
- Helper:
  - validasi status (`isValidStatus`), validasi transisi (`canTransitionStatus`)
  - label dan warna status (`getStatusLabel`, `getStatusColor`)
- CRUD/Query:
  - `createUserVoucher(userVoucher.toObject())` → koleksi `user_vouchers`
  - `getUserVouchersByUserId(userId)`
  - `checkUserVoucherExists(userId, voucherId)` (cek klaim duplikat)
  - `getAvailableUserVouchers(userId)` (filter `!isUsed || isUsed===0`)
  - `getUserVoucherByVoucherId(userId, voucherId)` (hanya yang `isUsed==false`)
  - `getUserVouchers(userEmail)`, `getUserAvailableVouchers(userEmail)`
- Status:
  - `updateVoucherStatus(userId, voucherId, newStatus)`: validasi enum + transisi, update status dan timestamp (`usedAt`, `claimedAt`, `updatedAt`), set `isUsed=true` untuk `USED` (kompatibilitas lama)
  - `getVouchersByStatus(userId, status)`, `getVoucherHistory(userId)`
  - `migrateExistingVouchers()`: migrasi data lama ke field `status` baru berbasis nilai `isUsed`, `isExpired`, `claimedAt`

### Services (Voucher)

- `CreateVoucherService.js`
  - Menerima body: `{ name, piece, startTime, endTime, info, voucherCode?, maxClaims? }`
  - Hitung tanggal:
    - `dateStart = today + startTime (hari), jam 00:00:00 UTC`
    - `dateEnd = dateStart + endTime (hari)`
    - Validasi `startDate <= endDate`
  - Map data voucher:
    - `ID`, `name`, `piece`, `dateStart`, `dateEnd`, `status: true`, `info`, `voucherCode: null|str`, `maxClaims: null|num`, `currentClaims: 0`
  - Simpan, lalu ambil ulang voucher aktif (`getVoucherActive`) dan format tanggal ke ISO untuk respons

- `GetVoucherActive.js`
  - Ambil voucher aktif (setelah proses auto-expire), respons format ISO date

- `UpdateVoucherService.js`
  - Rehitung tanggal (pakai util `checkDate`), set `status: true` saat edit

- `DeleteVoucherService.js`
  - Hapus berdasarkan `ID`

- `ClaimVoucherService.js` (klaim by voucherId)
  - Ambil `user.email` sebagai `userId`
  - Constraint: maksimal 1 voucher per user secara global
    - Query `user_vouchers.where('userId'==userEmail).limit(1)` → jika ada, tolak klaim
  - Transaksi Firestore:
    - Gunakan dokumen `user_vouchers` dengan ID unik: `userId_voucherId` (idempotensi klaim per user-per-voucherId)
    - Jika dokumen sudah ada → tolak klaim
    - Ambil `vouchers/{voucherId}`; jika tidak ada, fallback cek case-insensitive (iterasi semua, samakan `doc.id.toLowerCase()`)
    - Validasi:
      - belum expired (`Date.now() <= dateEnd._seconds*1000`)
      - `status==true`
      - `maxClaims==null || currentClaims < maxClaims`
    - Buat `user_voucher`:
      - `ID`, `userId`, `voucherId`, `name`, `piece`, `info`, `dateStart`, `dateEnd`, `claimedAt: now`, `isUsed:false`, `usedAt:null`, `status:'AVAILABLE'`
    - Update `vouchers/{voucherId}.currentClaims += 1`
  - Kembalikan `201 Created` dengan data klaim

- `ClaimVoucherByCodeService.js` (klaim by voucherCode)
  - Constraint global 1 voucher per user (cek `user_vouchers.where('userId'==email).limit(1)`)
  - Validasi kode:
    - Voucher ada (`getVoucherByCode()` → hanya `status==true`)
    - Voucher aktif, belum expired (`dateEnd`)
    - Batas klaim: `currentClaims < maxClaims` jika `maxClaims != null`
    - User belum pernah klaim voucher ini (`checkUserAlreadyClaimedVoucher(userEmail, voucher.ID)`)
  - Buat `UserVoucher` dan simpan via `createUserVoucher`
  - Update claim count voucher (`updateVoucherClaimCount`)
  - Respons `201 Created` dengan ringkasan voucher yang diklaim

- `GetUserVouchersService.js`
  - Ambil `user_vouchers` milik user, lalu ENRICH data `vouchers` via `getVoucherById`
  - Kembalikan daftar voucher dengan detail: `userVoucherId, voucherId, name, piece, info, dateStart, dateEnd, claimedAt, isUsed, usedAt, status`

- `GetAvailableVouchersService.js`
  - Ambil semua voucher aktif (`getVoucherActive`)
  - Ambil klaim user, lalu ENRICH
  - Filter `availableVouchers` = voucher aktif yang belum pernah diklaim user (cek `checkUserVoucherExists(userId, voucher.ID)`)
  - Respons objek gabungan:
    - `availableVouchers`: daftar (yang bisa diklaim)
    - `claimedVouchers`: daftar (yang sudah dimiliki user)

- `UpdateVoucherStatusService.js`
  - Input: `voucherId`, `status` (harus salah satu enum)
  - Update status di `user_vouchers` via `updateVoucherStatus` (validasi transisi)

### Integrasi Transaksi

File: `public/javascripts/service/transaction/TransactionService.js`
- Pembuatan transaksi memeriksa apakah request menyertakan `voucherId`:
  - Validasi user telah mengklaim voucher tersebut dan belum digunakan (`getUserVoucherByVoucherId(email, voucherId)` → `isUsed==false`)
  - Ambil voucher, hitung diskon persentase (`piece%` dari harga), dibatasi maksimal sebesar harga (tidak negatif)
  - Set harga final = `price - discount`
  - Tandai voucher sebagai digunakan: `markVoucherAsUsed(email, voucherId)` (yang internally memanggil `updateVoucherStatus` ke `USED` + set `isUsed=true`, `usedAt`)
- Catatan arsitektur:
  - Penandaan `USED` dilakukan saat perhitungan sebelum kepastian pembayaran tersettlement (API Snap Midtrans dipanggil setelah ini).
  - Disarankan menunda update status voucher ke callback notifikasi pembayaran sukses dari Midtrans (untuk menghindari voucher hilang jika pembayaran gagal/dibatalkan).

## Model Data & Storage

### Koleksi: vouchers
Field dari `CreateVoucherService.mapVoucherData` dan `UpdateVoucherService`:
- `ID: string` (UUID)
- `name: string`
- `piece: number` (persentase diskon)
- `dateStart: Timestamp` (Firestore)
- `dateEnd: Timestamp` (Firestore)
- `status: boolean` (active)
- `info: string`
- `voucherCode?: string|null` (opsional, untuk klaim by code)
- `maxClaims?: number|null` (opsional, batas total klaim)
- `currentClaims: number` (jumlah klaim saat ini; dimulai 0)

Kebijakan auto-expire:
- `getVoucherActive()` melakukan pengecekan durasi; jika `Date.now() > dateEnd`, update `status=false`. Hanya mengembalikan voucher yang tetap `status==true`.

### Koleksi: user_vouchers
Field dari `UserVoucherRepo.updateVoucherStatus`, `ClaimVoucherService`, dan entity:
- Identitas:
  - `ID: string` (kadang diset sebagai gabungan `userId_voucherId` di klaim by ID untuk idempotensi)
  - `userId: string` (umumnya `user.email`)
  - (Catatan: beberapa fungsi repo juga menggunakan `userEmail` sebagai field saat query. Perlu konsolidasi naming.)
- Relasi:
  - `voucherId: string`
- Status & waktu:
  - `status: enum('AVAILABLE'|'USED'|'EXPIRED'|'CLAIMED')` (tidak selalu ada pada data lama → ada migrasi)
  - `claimedAt: Date`
  - `isUsed: boolean` (kompatibilitas lama; saat `USED`, diset `true`)
  - `usedAt: Date|null`
  - `updatedAt: Date`
- Catatan: Pada `ClaimVoucherService` status awal diset `'AVAILABLE'`.

### Enum Status & Transisi
Dari `UserVoucherRepo.js`:
- Enum: `AVAILABLE`, `USED`, `EXPIRED`, `CLAIMED`
- Transisi valid:
  - `CLAIMED -> AVAILABLE | EXPIRED`
  - `AVAILABLE -> USED | EXPIRED | CLAIMED`
  - `USED` dan `EXPIRED` adalah final (tidak ada transisi lanjut)

## Alur Bisnis

1) Admin membuat voucher
- Input offset hari `startTime`, `endTime`
- `dateStart = now + startTime (00:00 UTC)`
- `dateEnd = dateStart + endTime`
- Validasi `startDate <= endDate`
- Set `status=true`, `currentClaims=0`, `voucherCode`/`maxClaims` opsional
- Simpan dan kembalikan daftar voucher aktif terbaru

2) User mengklaim voucher
- Batas global: maksimal 1 voucher per user (dicek pada `claim-by-id` dan `claim-by-code` via query `limit(1)`)
- Validasi voucher:
  - ada & `status==true`
  - belum expired (`dateEnd`)
  - `currentClaims < maxClaims` (jika `maxClaims != null`)
  - user belum pernah klaim voucher ini (by code: `checkUserAlreadyClaimedVoucher`; by id: ID unik dokumen mencegah duplikat)
- Buat dokumen `user_vouchers` (status awal `'AVAILABLE'`)
- Update `vouchers.currentClaims += 1`

3) Penggunaan voucher pada transaksi
- Validasi user memiliki voucher dan belum digunakan
- Hitung diskon persentase (`piece`) terhadap harga
- Pastikan diskon tidak melebihi harga (`min(discount, price)`)
- Tandai voucher sebagai `USED` (update status + set `isUsed=true`)

4) Manajemen status
- Update status via `UpdateVoucherStatusService` (hanya enum valid dan transisi valid yang diizinkan)
- Auto-expire saat listing voucher aktif pada level `vouchers` (bukan `user_vouchers`)

## Endpoint API (Ringkas)

Otorisasi diatur dengan `authorizeRole` dan token via Firebase.

- ADMIN
  - `POST /api/voucher/created`
    - Body: `{ name, piece, startTime, endTime, info, voucherCode?, maxClaims? }`
    - Respons: daftar voucher aktif (tanggal ISO)
  - `DELETE /api/voucher/delete/:id`
  - `PUT /api/voucher/edit/:id`
    - Body: `{ name, piece, startTime, endTime, info }`

- USER/ADMIN
  - `GET /api/voucher/get`
    - Daftar voucher aktif (tanggal ISO)

- USER
  - `POST /api/voucher/claim/:voucherId`
  - `POST /api/voucher/claim-by-code`
    - Body: `{ voucherCode: string }` (validasi kode, aktif, expiry, maxClaims, non-duplikat)
  - `GET /api/voucher/my-vouchers`
    - Voucher milik user (dengan enrichment detail voucher)
  - `GET /api/voucher/my-available`
    - Voucher milik user yang belum digunakan dan belum expired
  - `GET /api/voucher/available-to-claim`
    - Voucher aktif yang belum diklaim user

- Status update (USER)
  - Layanan: `UpdateVoucherStatusService.js` (payload: `{ voucherId, status }`, status harus salah satu enum, transisi valid)

Catatan: File `MentorMe-BE/API/voucher.md` mendokumentasi CRUD dasar. Endpoint tambahan (claim, claim-by-code, my-vouchers, my-available, available-to-claim, update-status) perlu ditambahkan ke dokumentasi tersebut agar konsisten dengan implementasi.

## Validasi, Error Handling, dan Keamanan

- Validasi tanggal dan expiry
- Validasi batas klaim (`maxClaims`)
- Single-claim per user (global) diberlakukan saat klaim (baik by ID maupun by code)
- Idempotensi sebagian via penamaan dokumen `user_vouchers` (`userId_voucherId`) pada klaim by ID
- Error handling konsisten memakai `APIResponse` dan `HttpStatus`
- Keamanan via `authorizeRole` (USER/ADMIN) dan `verifyFirebaseToken`
- Parsing `dateEnd` saat filter voucher pembayaran menangani berbagai tipe (`_seconds`, `toDate()`, `Date`, string)

## Edge Cases dan Catatan Teknis

- Inkonsistensi field user: beberapa query uses `userId`, beberapa `userEmail` → perlu konsolidasi field yang dipakai (rekomendasi: gunakan satu field konsisten, mis. `userId = user.email`).
- `ClaimVoucherByCodeService` membuat instance `UserVoucher` dengan parameter lebih banyak dari definisi entity `UserVoucher` saat ini. Karena `createUserVoucher` hanya menyimpan `toObject()`, properti ekstra (seperti `name`, `piece`, `info`, `dateStart`, `dateEnd`, `status`) tidak ikut tersimpan. Enrichment downstream masih bekerja karena data detail voucher diambil dari koleksi `vouchers`. Disarankan:
  - Samakan kontrak entity `UserVoucher` dan pemanggilnya atau gunakan object literal langsung untuk fleksibilitas.
- `listVoucherActive()` mengembalikan `HttpStatus.CREATED` (201) meski ini adalah operasi GET; sebaiknya gunakan `200 OK`.
- Penandaan voucher `USED` dilakukan sebelum konfirmasi pembayaran sukses. Disarankan pindahkan update status voucher ke webhook/notification Midtrans ketika transaksi benar-benar sukses.
- Auto-expire di level `vouchers` terjadi saat query list aktif; pertimbangkan job terjadwal (Cloud Scheduler/Functions) untuk menetapkan `status=false` tepat saat kadaluwarsa agar konsisten di seluruh akses.
- Idempotensi klaim by code belum memastikan dokumen ID unik `userId_voucherId` (berbeda dengan klaim by ID). Rekomendasi menstandarkan ID dokumen atau cek duplikat yang setara.
- Index Firestore: pertimbangkan index untuk query kombinasi yang sering dipakai (`user_vouchers`: userId+voucherId, userId+status; `vouchers`: status, voucherCode+status).

## Rekomendasi Peningkatan

1) Dokumentasi API
- Perbarui `MentorMe-BE/API/voucher.md` dengan endpoint:
  - `POST /api/voucher/claim/:voucherId`
  - `POST /api/voucher/claim-by-code`
  - `GET /api/voucher/my-vouchers`
  - `GET /api/voucher/my-available`
  - `GET /api/voucher/available-to-claim`
  - Endpoint update status user_voucher (payload contoh dan valid transition)

2) Konsistensi Data
- Standarkan field identitas user di `user_vouchers` (gunakan `userId` atau `userEmail`, satu saja).
- Standarkan ID dokumen klaim (`userId_voucherId`) untuk idempotensi di semua jalur klaim.

3) Alur Transaksi
- Tunda update status voucher menjadi `USED` setelah pembayaran tersettlement (via webhook Midtrans), bukan di awal proses.

4) Validasi & Mutasi
- Tambahkan validasi format `voucherCode` (sudah ada helper di claim-by-code; gunakan saat create/update agar konsisten).
- Tangani secara periodik status `EXPIRED` pada `user_vouchers` bila perlu.

5) Kinerja & Indexing
- Buat index Firestore yang relevan (userId+status, voucherCode+status) untuk performa query.

## Contoh Payload

- Create voucher (ADMIN)
```json
{
  "name": "Voucher Akhir Tahun",
  "piece": 20,
  "startTime": 0,
  "endTime": 10,
  "info": "Diskon 20% hingga 10 hari",
  "voucherCode": "AKHIRTAHUN20",
  "maxClaims": 100
}
```

- Claim by code (USER)
```json
{
  "voucherCode": "AKHIRTAHUN20"
}
```

- Update status user voucher (USER)
```json
{
  "voucherId": "VOUCHER_ID",
  "status": "USED"
}
```

## Daftar File Terkait

- Router:
  - `functions/routes/VoucherRouter.js`
- Repositori:
  - `public/javascripts/repo/VoucherRepo.js`
  - `public/javascripts/repo/UserVoucherRepo.js`
- Services Voucher:
  - `CreateVoucherService.js`, `GetVoucherActive.js`, `UpdateVoucherService.js`, `DeleteVoucherService.js`
  - `ClaimVoucherService.js`, `ClaimVoucherByCodeService.js`
  - `GetUserVouchersService.js`, `GetAvailableVouchersService.js`
  - `UpdateVoucherStatusService.js`
- Transaksi:
  - `public/javascripts/service/transaction/TransactionService.js`
- Entity:
  - `public/javascripts/entity/UserVoucher.js`
- Dokumentasi API:
  - `MentorMe-BE/API/voucher.md` (perlu dilengkapi endpoint baru di atas)

---
Dokumen ini menyajikan kondisi implementasi saat ini dan rekomendasi praktis untuk peningkatan konsistensi, keandalan, dan performa fitur voucher di Backend MentorMe.
