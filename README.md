# Sneaker Head Express Server

Server backend cho du an Sneaker Head duoc xay dung bang Node.js + Express.js + MongoDB Atlas (Mongoose).

## 1) Cai dat

```bash
cd backend/server
npm install
```

## 2) Cau hinh bien moi truong

Tao file `.env` trong `backend/server`:

```env
MONGO_URI=mongodb+srv://trantiep:1323334353@cluster0.oudljlu.mongodb.net/sneakerhead?retryWrites=true&w=majority
```

## 3) Chay server development

```bash
npm run dev
```

Mac dinh server chay tai:

- `http://localhost:3001`
- Prefix API: `http://localhost:3001/api`

## 4) API endpoints

### Products

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Orders

- `GET /api/orders`
- `POST /api/orders`

## 5) Quy tac tao don hang (`POST /api/orders`)

Khi tao order:

1. Server kiem tra tung item co du ton kho khong.
2. Neu co item khong du stock, API tra ve `400` va danh sach item loi.
3. Neu du stock, server se:
   - Tao order moi trong collection `orders`
   - Tru ton kho trong collection `products`

## 6) Models MongoDB

Server su dung cac model Mongoose:

- `models/Product.js`
- `models/Order.js`
- `models/User.js`
