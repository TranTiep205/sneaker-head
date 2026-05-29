const dotenv = require("dotenv");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const Product = require("./models/Product");
const Order = require("./models/Order");
const User = require("./models/User");

dotenv.config();

const productsSeed = [
  {
    id: 1,
    name: "Nike Air Jordan 1 Retro High OG",
    price: 4590000,
    image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
    category: "Basketball",
    brand: "Nike",
    gender: "Unisex",
    stock: 18,
    desc: "Giay co dien Jordan 1 phien ban High OG voi upper da cao cap.",
  },
  {
    id: 2,
    name: "Adidas Ultraboost Light",
    price: 3890000,
    image: "https://images.pexels.com/photos/19090/pexels-photo.jpg",
    category: "Running",
    brand: "Adidas",
    gender: "Men",
    stock: 25,
    desc: "Dem Boost em va nhe cho chay bo hang ngay.",
  },
  {
    id: 3,
    name: "New Balance 550",
    price: 2990000,
    image: "https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg",
    category: "Lifestyle",
    brand: "New Balance",
    gender: "Unisex",
    stock: 14,
    desc: "Form giay retro bong ro, de phoi do streetwear.",
  },
  {
    id: 4,
    name: "Puma RS-X Efekt",
    price: 2590000,
    image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg",
    category: "Lifestyle",
    brand: "Puma",
    gender: "Women",
    stock: 20,
    desc: "Thiet ke chunky RS-X noi bat, dem EVA ben bi.",
  },
  {
    id: 5,
    name: "Converse Chuck 70 High",
    price: 1890000,
    image: "https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg",
    category: "Classic",
    brand: "Converse",
    gender: "Unisex",
    stock: 30,
    desc: "Phien ban nang cap cua Chuck Taylor voi canvas day va de em.",
  },
  {
    id: 6,
    name: "Vans Old Skool",
    price: 1690000,
    image: "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg",
    category: "Skate",
    brand: "Vans",
    gender: "Unisex",
    stock: 28,
    desc: "Mau giay skate kinh dien voi side stripe dac trung.",
  },
  {
    id: 7,
    name: "ASICS Gel-Kayano 30",
    price: 4290000,
    image: "https://images.pexels.com/photos/6050917/pexels-photo-6050917.jpeg",
    category: "Running",
    brand: "ASICS",
    gender: "Men",
    stock: 16,
    desc: "Dong giay stability cho chay dai, ho tro ban chan toi uu.",
  },
  {
    id: 8,
    name: "Nike Air Force 1 '07",
    price: 2890000,
    image: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg",
    category: "Lifestyle",
    brand: "Nike",
    gender: "Women",
    stock: 22,
    desc: "Bieu tuong streetwear bat hu voi phan de Air em ai.",
  },
  {
    id: 9,
    name: "Adidas Samba OG",
    price: 2490000,
    image: "https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg",
    category: "Lifestyle",
    brand: "Adidas",
    gender: "Unisex",
    stock: 19,
    desc: "Phom thap co dien, chat da mem va de gum danh cho outfit toi gian.",
  },
  {
    id: 10,
    name: "Reebok Club C 85",
    price: 2190000,
    image: "https://images.pexels.com/photos/2048548/pexels-photo-2048548.jpeg",
    category: "Classic",
    brand: "Reebok",
    gender: "Unisex",
    stock: 24,
    desc: "Thiet ke toi gian de mang hang ngay, trong luong nhe.",
  },
  {
    id: 11,
    name: "Nike Dunk Low Panda",
    price: 3290000,
    image: "https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg",
    category: "Lifestyle",
    brand: "Nike",
    gender: "Unisex",
    stock: 21,
    desc: "Phien ban mau den trang de phoi do, phu hop daily wear.",
  },
  {
    id: 12,
    name: "Adidas Forum Low",
    price: 2790000,
    image: "https://images.pexels.com/photos/6532374/pexels-photo-6532374.jpeg",
    category: "Basketball",
    brand: "Adidas",
    gender: "Unisex",
    stock: 17,
    desc: "Giay low-top phong cach retro, upper da ben dep.",
  },
];

const ordersSeed = [
  {
    id: 1001,
    userId: 2,
    items: [
      { productId: 1, name: "Nike Air Jordan 1 Retro High OG", qty: 1, price: 4590000 },
      { productId: 6, name: "Vans Old Skool", qty: 1, price: 1690000 },
    ],
    total: 6280000,
    status: "pending",
    createdAt: new Date("2026-05-01T09:15:00Z"),
  },
  {
    id: 1002,
    userId: 3,
    items: [{ productId: 2, name: "Adidas Ultraboost Light", qty: 1, price: 3890000 }],
    total: 3890000,
    status: "shipping",
    createdAt: new Date("2026-05-03T14:20:00Z"),
  },
  {
    id: 1003,
    userId: 2,
    items: [{ productId: 5, name: "Converse Chuck 70 High", qty: 2, price: 1890000 }],
    total: 3780000,
    status: "completed",
    createdAt: new Date("2026-05-05T11:45:00Z"),
  },
  {
    id: 1004,
    userId: 3,
    items: [
      { productId: 8, name: "Nike Air Force 1 '07", qty: 1, price: 2890000 },
      { productId: 9, name: "Adidas Samba OG", qty: 1, price: 2490000 },
    ],
    total: 5380000,
    status: "cancelled",
    createdAt: new Date("2026-05-06T08:05:00Z"),
  },
];

const usersSeed = [
  {
    id: 1,
    name: "Admin SneakerHead",
    email: "admin@sneakerhead.local",
    password: "admin123",
    role: "admin",
  },
  {
    id: 2,
    name: "Nguyen Van A",
    email: "customer1@sneakerhead.local",
    password: "customer123",
    role: "user",
  },
  {
    id: 3,
    name: "Tran Thi B",
    email: "customer2@sneakerhead.local",
    password: "customer123",
    role: "user",
  },
];

async function seedDatabase() {
  try {
    await connectDB();

    // Clear old data to make seed deterministic.
    await Promise.all([Product.deleteMany({}), Order.deleteMany({}), User.deleteMany({})]);

    await Product.insertMany(productsSeed);
    await User.insertMany(usersSeed);
    await Order.insertMany(ordersSeed);

    console.log("Seed completed successfully");
    console.log(`Products: ${productsSeed.length}`);
    console.log(`Orders: ${ordersSeed.length}`);
    console.log(`Users: ${usersSeed.length}`);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seedDatabase();
