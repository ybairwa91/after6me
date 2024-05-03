const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.SERVER.replace("PASSWORD", process.env.PASSWORD);

mongoose.connect(DB).then(() => console.log("DB Connection successful"));

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`App running on the port ${PORT}`);
});
