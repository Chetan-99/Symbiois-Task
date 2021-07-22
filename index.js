const express = require("express");
const app = express();
const cors = require("cors");
const api = require("./api");
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use("/images", api);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
