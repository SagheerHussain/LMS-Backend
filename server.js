const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { dbConnection } = require("./config/config");

// Built in Middlewares
const app = express();

// Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://library-management-system-nu-fawn.vercel.app",
  "https://library.skynetsilicon.com"
];

// Middlewares
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // If using cookies/token headers
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mongo Db Connection
dbConnection();

// Import Routes
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authorRoutes = require("./routes/authorRoutes");
const reviewRoutes = require("./routes/reviewsRoutes");
const borrowedRoutes = require("./routes/borrowedRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/borrowed", borrowedRoutes);

// Server
app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
