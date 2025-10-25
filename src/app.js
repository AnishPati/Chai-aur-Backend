import express from "express";
import cors from "cors"; // cross origin resorce sharing
import cookieParser from "cookie-parser";

const app = express();

app.use(
  //app.use is only used to do middileware or config settings
  //Helps to do setting with cross origin resource sharing
  cors({
    origin: process.env.CORS_ORIGIN, //CORS_ORIGIN is used to accept req from any specific url or vercel
    cradentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); //taking data from forms using json and setting it's limits

app.use(express.urlencoded({ extended: true, limit: "16kb" })); //taking data from url

app.use(express.static("public")); //A folder to store some items, images etc...

app.use(cookieParser()); // Getting access of secure cookies from the brwoser by the server secretly and perform crud operations

//Routes import
import userRouter from "./routes/user.routes.js";

//Routes declaration
app.use("/api/v1/users", userRouter); //https:localhost:8000/api/v1/users
export { app };
