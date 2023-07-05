const app = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const PORT = 3001;
app.listen(PORT, (err) => {
  console.log(`App running on port ${PORT}...`);
});
