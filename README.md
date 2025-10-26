# MasPOS API

REST API untuk Point of Sale sederhana menggunakan Node.js, Express, Prisma (PostgreSQL), JWT Auth, dan Multer untuk upload gambar produk.

## Tech Stack

- Node.js + Express
- Prisma ORM (PostgreSQL)
- JSON Web Token (JWT)
- Multer (file upload)
- dotenv, cors, cookie-parser

## Prasyarat

- Node.js 18+ dan npm
- PostgreSQL berjalan dan dapat diakses

## Instalasi

1. Clone dan masuk ke folder proyek

```
git clone <repo-url>
cd maspos
```

2. Instal dependensi

```
npm install
```

3. Buat file .env pada root proyek

```
# contoh
PORT=5025
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<db>?schema=public"
JWT_SECRET="super-secret-key"
NODE_ENV=development
```

4. Setup database Prisma (generate client + apply migration)

```
npx prisma generate
npx prisma migrate dev --name init
# opsional: lihat DB
npx prisma studio
```

5. Jalankan server (development)

```
npm run dev
```

Server akan berjalan di http://localhost:${PORT} (default 3000 jika PORT tidak di-set).

## Pola Respons API

Semua respons dibungkus dalam format berikut:

```
{
  "success": boolean,
  "message": string,
  "data": any | null
}
```

## Autentikasi

- Login mengembalikan token JWT pada field data.token dan juga menyetel cookie `token` (httpOnly).
- Middleware autentikasi saat ini hanya membaca Authorization header, bukan cookie.
- Sertakan header berikut untuk semua endpoint bertanda [Protected]:

```
Authorization: Bearer <token>
```

## Base URL

```
http://localhost:<PORT>/api
```

## Endpoint

### Auth

1. POST /api/auth/register

- Body (JSON): { name, username, password }
- Respons: user info (id, name, username)

2. POST /api/auth/login

- Body (JSON): { username, password }
- Respons: { userId, username, token }

3. POST /api/auth/logout

- Menghapus cookie token. Tidak perlu header Authorization.

### Categories [Protected]

1. GET /api/categories

- Ambil semua kategori.

2. GET /api/categories/:id

- Ambil kategori berdasarkan id.

3. POST /api/categories

- Body (JSON): { name }
- Buat kategori.

4. PUT /api/categories/:id

- Body (JSON): { name }
- Update kategori.

5. DELETE /api/categories/:id

- Hapus kategori.

### Products [Protected]

1. GET /api/products

- Ambil semua produk (include category). Field image akan dikembalikan sebagai URL penuh bila tersedia.

2. GET /api/products/:id

- Ambil detail produk.

3. GET /api/products/categories/:id

- Ambil produk berdasarkan categoryId.

4. POST /api/products

- Content-Type: multipart/form-data
- Fields: name (string), price (number/int), categoryId (string)
- File (opsional): image (JPEG/JPG/PNG)
- Menyimpan file ke folder `uploads/` dan mengembalikan URL gambar.

5. PUT /api/products/:id

- Content-Type: multipart/form-data
- Fields: name, price, categoryId
- File (opsional): image (JPEG/JPG/PNG) — jika upload baru, file lama akan dihapus.

6. DELETE /api/products/:id

- Hapus produk (beserta file gambar bila ada).

### Carts [Protected]

1. GET /api/carts

- Ambil semua item cart milik user login.

2. POST /api/carts

- Body (JSON): { productId, quantity }
- Tambah item ke cart, total = price \* quantity.

### Transactions [Protected]

1. POST /api/transactions/checkout

- Membuat transaksi dari seluruh item cart user, lalu mengosongkan cart user tersebut.

2. GET /api/transactions

- Ambil semua transaksi.

3. GET /api/transactions/:id

- Ambil detail transaksi berdasarkan id.

## Catatan Penting

- Uploads: berkas gambar disimpan di folder `uploads/`. Untuk dapat mengaksesnya langsung via URL, tambahkan middleware static express pada server Anda, misalnya:
  ```js
  app.use("/uploads", express.static("uploads"));
  ```
- Route priority: di `src/routes/product.route.js`, rute `GET /api/products/:id` saat ini dideklarasikan sebelum `GET /api/products/categories/:id`. Di Express, urutan penting; pertimbangkan memindahkan rute `/categories/:id` ke atas agar tidak tertangkap oleh `/:id`.
- Authorization: middleware membaca token dari header Authorization. Token pada cookie tidak otomatis dipakai untuk proteksi endpoint.

## Scripts npm

- dev: jalankan server dengan nodemon

## Lisensi

ISC
