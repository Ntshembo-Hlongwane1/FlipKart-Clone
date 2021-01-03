import express, { Application } from 'express';
import { config } from 'dotenv';
import mongoose, { CastError, ConnectOptions } from 'mongoose';
import expressSession from 'express-session';
import MongoStore, { MongoDBStore } from 'connect-mongodb-session';
import cors from 'cors';
config();

const app: Application = express();
enum BaseUrl {
  dev = 'http://localhost:3000',
  prod = ''
}
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? BaseUrl.prod : BaseUrl.dev,
  credentials: true
};

const mongoURI = process.env.mongoURI;
//======================================================Middleware==============================================================
app.use(cors(corsOptions));

const mongoStore = MongoStore(expressSession);

const store: MongoDBStore = new mongoStore({
  collection: 'usersession',
  uri: mongoURI,
  expires: 10 * 60 * 60 * 24 * 1000
});

const isCookieSecure: boolean = process.env.NODE_ENV === 'production' ? true : false;

app.use(
  expressSession({
    secret: process.env.session_secret,
    name: '_sid',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      maxAge: 10 * 60 * 60 * 24 * 1000,
      secure: isCookieSecure,
      sameSite: false
    }
  })
);

//================================================MongoDB Connection & Configs==================================================
const connectionOptions: ConnectOptions = {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(mongoURI, connectionOptions, (error: CastError) => {
  if (error) {
    return console.error(error.message);
  }
  return console.log('Connection to MongoDB was successful');
});

//===============================================Server Connection & Configd====================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
