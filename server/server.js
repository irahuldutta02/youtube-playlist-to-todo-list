const express = require("express");
const { PORT } = require("./server.config");
const apiRoutes = require("./routes/api.routes");
const { pingController } = require("./controllers/controller");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.text());

app.get("/", pingController);
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
