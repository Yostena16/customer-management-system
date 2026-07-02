// near the top with the other requires
const authRoutes = require("./routes/authRoutes");
const auth = require("./middleware/auth");
const express = require("express");
const cors = require("cors");

require("dotenv").config();


const sequelize = require("./config/database");
const customerRoutes = require("./routes/customerRoutes");


const app = express();

// Middleware
app.use(cors());              // allow the React frontend to call this API
app.use(express.json());      // parse incoming JSON request bodies
app.use("/api/auth", authRoutes);

// Routes
app.use("/api/customers", auth, customerRoutes);

// A simple health-check route
app.get("/", (req, res) => {
  res.send("CRM API is running ✅");
});

const PORT = process.env.PORT || 5000;

// Connect to DB, sync tables, then start the server
sequelize
  .sync() // creates the "customers" table if it doesn't exist
  .then(() => {
    console.log("✅ Database connected & synced");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err.message);
  });