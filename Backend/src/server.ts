import express, { Application } from 'express';
import { config } from 'dotenv';
import { CastError, ConnectOptions, connect } from 'mongoose';
import expressSession from 'express-session';
import MongoStore, { MongoDBStore } from 'connect-mongodb-session';
import cors from 'cors';
config();
//==============================================================Routes Import===================================================
import AuthRoute from './Routes/Auth/Auth';

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

const cookieAge: number = 10 * 60 * 60 * 24 * 1000;
const store: MongoDBStore = new mongoStore({
  collection: 'usersessions',
  uri: mongoURI,
  expires: cookieAge
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
      maxAge: cookieAge,
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

connect(mongoURI, connectionOptions, (error: CastError) => {
  if (error) {
    return console.error(error.message);
  }
  return console.log('Connection to MongoDB was successful');
});

//====================================================Server Endpoints==========================================================
app.use(AuthRoute);

//===============================================Server Connection & Configd====================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
