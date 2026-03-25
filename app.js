const express = require("express");
require("dotenv").config();

const productRoutes = require("./routes/products");
const inventoryRoutes = require("./routes/inventories");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Inventory with SQL Server is running",
  });
});

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/inventories", inventoryRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});