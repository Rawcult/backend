require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const cookieParser = require("cookie-parser");

const cors = require("cors");

const connectDB = require("./db/connect");

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const orderRouter = require("./routes/orderRoutes");
const googleRouter = require("./routes/googleRoutes");
const cartRouter = require("./routes/cartRoutes");
// const firebaseRouter = require("./routes/firebaseRoutes");

const notFoundMiddleware = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");

app.use(cors({ credentials: true }));

// app.use(morgan("dev"));
app.use(express.json({ limit: "1gb" }));
app.use(fileUpload({ useTempFiles: true }));
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use(googleRouter);
app.use("/cart", cartRouter);
// app.use("/firebase", firebaseRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
    app.listen(port, () => {
      console.log(`Server is listening to port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
