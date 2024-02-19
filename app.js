require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");

const passport = require("passport");
const MongoStore = require("connect-mongo");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
const authRoutes = require("./routes/authRouter");
const pagesRoutes = require("./routes/pagesRouter");
const adminRoutes = require("./routes/adminRouter");
const postRoutes = require("./routes/postRouter");

require("./controllers/passport");

const db = require("./db/connect");

app.use("/css", express.static(path.join(__dirname, "/assets/css")));
app.use("/images", express.static(path.join(__dirname, "/assets/images")));
app.use("/js", express.static(path.join(__dirname, "/assets/js")));
app.use("/json", express.static(path.join(__dirname, "/assets/json")));
app.use("/scss", express.static(path.join(__dirname, "/assets/scss")));
app.use("/vendor", express.static(path.join(__dirname, "/assets/vendor")));
app.use("/img", express.static(path.join(__dirname, "/assets/img")));
app.use("/posts", express.static(path.join(__dirname, "/posts")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongoUrl: process.env.MONGO_URI }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.use("/auth", authRoutes);
app.use("/", pagesRoutes);
app.use("/admin", adminRoutes);
app.use("/api/v1/post", postRoutes);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await db(process.env.MONGO_URI);
    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
