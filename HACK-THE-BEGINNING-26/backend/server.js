const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const parkingRoutes = require("./routes/parkingRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));

app.use("/api/parking", parkingRoutes);

app.get("/", (req, res) => {
  res.send("ZEN PARK AI Backend Running");
});

// ✅ NEW DB CONNECTION
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://syedanish2419_db_user:Syed123@cluster0.lytfo1l.mongodb.net/?appName=Cluster0/zen_park_ai", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

connectDB();

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});