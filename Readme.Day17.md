# **Alur Postman**

## **📝 STEP 1: REGISTER USER (ADMIN)**

### **Request:**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "RizqiSetiawan",
  "email": "rizqi@example.com",
  "password": "Admin1234#",
  "role": "ADMIN"
}
```

### **Response Success (201):**
```json
{
  "success": true,
  "message": "User berhasil didaftarkan",
  "data": {
    "id": 1,
    "username": "RizqiSetiawan",
    "email": "rizqi@example.com",
    "role": "ADMIN",
    "createdAt": "2024-12-19T10:00:00.000Z"
  }
}
```

## **📝 STEP 2: LOGIN USER**

### **Request:**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "rizqi@example.com",
  "password": "Admin1234#"
}
```

### **Response Success (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJyaXpxaUBleGFtcGxlLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTczNDY1NjAwMCwiZXhwIjoxNzM0NzQyNDAwfQ.sample_token_here",
    "user": {
      "id": 1,
      "username": "RizqiSetiawan",
      "email": "rizqi@example.com",
      "role": "ADMIN"
    }
  }
}
```

## **📝 STEP 3: CREATE PROFILE**

### **Request:**
```http
POST http://localhost:5000/api/profiles
Content-Type: multipart/form-data
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

name: Rizqi Setiawan
gender: MALE
address: Yogyakarta, Indonesia
profile_picture: [FILE - rizqi_profile.jpg]
```

### **Response Success (201):**
```json
{
  "success": true,
  "message": "Profile berhasil dibuat",
  "data": {
    "id": 1,
    "name": "Rizqi Setiawan",
    "gender": "MALE",
    "address": "Yogyakarta, Indonesia",
    "profile_picture_url": "https://storage.example.com/profiles/rizqi_profile.jpg",
    "user_id": 1,
    "user": {
      "id": 1,
      "username": "RizqiSetiawan",
      "email": "rizqi@example.com"
    }
  }
}
```

## **📝 STEP 4: CREATE CATEGORY**

### **Request:**
```http
POST http://localhost:5000/api/categories
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "name": "Electronics"
}
```

### **Response Success (201):**
```json
{
  "success": true,
  "message": "Kategori berhasil dibuat",
  "data": {
    "id": 1,
    "name": "Electronics",
    "createdAt": "2024-12-19T10:05:00.000Z",
    "updatedAt": "2024-12-19T10:05:00.000Z"
  }
}
```

## **📝 STEP 5: CREATE PRODUCT**

### **Request:**
```http
POST http://localhost:5000/api/products
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "name": "Smartphone X Pro",
  "description": "Flagship smartphone dengan kamera canggih",
  "price": 12999999,
  "stock": 100,
  "image": "https://example.com/images/smartphone-x-pro.jpg",
  "categoryId": 1
}
```

### **Response Success (201):**
```json
{
  "success": true,
  "message": "Produk berhasil dibuat",
  "data": {
    "id": 1,
    "name": "Smartphone X Pro",
    "description": "Flagship smartphone dengan kamera canggih",
    "price": 12999999,
    "stock": 100,
    "categoryId": 1,
    "category": {
      "id": 1,
      "name": "Electronics"
    }
  }
}
```

## **📝 STEP 6: CHECKOUT (CREATE ORDER)**

### **Request:**
```http
POST http://localhost:5000/api/orders/checkout
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "orderItems": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "user_id": 1
}
```

### **Response Success (201):**
```json
{
  "success": true,
  "message": "Checkout berhasil",
  "data": {
    "order_id": 1,
    "user": {
      "id": 1,
      "name": "Rizqi Setiawan",
      "email": "rizqi@example.com"
    },
    "total": 25999998,
    "items": [
      {
        "product_id": 1,
        "product_name": "Smartphone X Pro",
        "price": 12999999,
        "quantity": 2,
        "subtotal": 25999998
      }
    ],
    "total_items": 1,
    "created_at": "2024-12-19T10:10:00.000Z"
  }
}
```

## **📝 STEP 7: GET ALL ORDERS (VERIFIKASI)**

### **Request:**
```http
GET http://localhost:5000/api/orders?page=1&limit=10&userId=1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Response Success (200):**
```json
{
  "success": true,
  "message": "Data orders berhasil diambil",
  "data": {
    "orders": [
      {
        "id": 1,
        "user_id": 1,
        "total": 25999998,
        "orderItems": [
          {
            "id": 1,
            "product_id": 1,
            "quantity": 2,
            "product": {
              "name": "Smartphone X Pro",
              "price": 12999999,
              "image": "https://example.com/images/smartphone-x-pro.jpg"
            }
          }
        ],
        "user": {
          "username": "RizqiSetiawan",
          "email": "rizqi@example.com"
        },
        "createdAt": "2024-12-19T10:10:00.000Z"
      }
    ],
    "total": 1,
    "totalPages": 1,
    "currentPage": 1
  }
}
```

## **📝 STEP 8: GET ORDER ITEMS BY ORDER ID**

### **Request:**
```http
GET http://localhost:5000/api/order-items?order_id=1&page=1&limit=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Response Success (200):**
```json
{
  "success": true,
  "message": "Data order items berhasil diambil",
  "data": {
    "orderItems": [
      {
        "id": 1,
        "order_id": 1,
        "product_id": 1,
        "quantity": 2,
        "order": {
          "id": 1,
          "total": 25999998,
          "user": {
            "username": "RizqiSetiawan",
            "email": "rizqi@example.com"
          }
        },
        "product": {
          "name": "Smartphone X Pro",
          "price": 12999999,
          "image": "https://example.com/images/smartphone-x-pro.jpg"
        },
        "createdAt": "2024-12-19T10:10:00.000Z"
      }
    ],
    "total": 1,
    "totalPages": 1,
    "currentPage": 1
  }
}
```

## **📝 STEP 9: UPDATE PROFILE (UBAH ALAMAT KE JOGJA)**

### **Request:**
```http
PATCH http://localhost:5000/api/profiles/1
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "address": "Jl. Malioboro No. 123, Yogyakarta",
  "gender": "MALE"
}
```

### **Response Success (200):**
```json
{
  "success": true,
  "message": "Profile berhasil diperbarui",
  "data": {
    "id": 1,
    "name": "Rizqi Setiawan",
    "gender": "MALE",
    "address": "Jl. Malioboro No. 123, Yogyakarta",
    "profile_picture_url": "https://storage.example.com/profiles/rizqi_profile.jpg",
    "user_id": 1,
    "updatedAt": "2024-12-19T10:15:00.000Z"
  }
}
```

## **📝 STEP 10: GET PROFILE (VERIFIKASI UPDATE)**

### **Request:**
```http
GET http://localhost:5000/api/profiles/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Response Success (200):**
```json
{
  "success": true,
  "message": "Profile berhasil diambil",
  "data": {
    "id": 1,
    "name": "Rizqi Setiawan",
    "gender": "MALE",
    "address": "Jl. Malioboro No. 123, Yogyakarta",
    "profile_picture_url": "https://storage.example.com/profiles/rizqi_profile.jpg",
    "user_id": 1,
    "user": {
      "id": 1,
      "username": "RizqiSetiawan",
      "email": "rizqi@example.com",
      "role": "ADMIN"
    },
    "createdAt": "2024-12-19T10:01:00.000Z",
    "updatedAt": "2024-12-19T10:15:00.000Z"
  }
}
```

## **🎯 KETERANGAN IMPORTANT:**
1. **Token Authentication**: Token dari STEP 2 digunakan di semua request berikutnya
2. **ID Management**: ID yang dihasilkan (user_id=1, category_id=1, product_id=1, order_id=1) digunakan di request selanjutnya
3. **Alamat diubah**: Dari "Yogyakarta, Indonesia" menjadi "Jl. Malioboro No. 123, Yogyakarta"
4. **Form-data**: STEP 3 menggunakan `multipart/form-data` untuk upload file profile picture
5. **Repository Pattern**: Semua endpoint sekarang menggunakan repository-service pattern yang sudah kamu buat

Pastikan endpoint URL sesuai dengan konfigurasi server kamu (`localhost:5000/api`).