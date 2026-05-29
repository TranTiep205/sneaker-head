const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const cartRoutes = require('./routes/cart');
const uploadRoutes = require('./routes/upload');
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors({

    origin: [

        'http://localhost:5500',

        'http://localhost:3000',

        'http://127.0.0.1:5500',

        'https://sneakerhead-frontend-mu.vercel.app' 

    ],

    credentials: true

}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "Sneaker Head API is running",
    basePath: "/api",
  });
});

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/upload', uploadRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({ message: "Internal server error" });
});

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
