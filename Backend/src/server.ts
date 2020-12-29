import express, { Application } from "express";

const app: Application = express();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
