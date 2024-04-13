const express = require("express");
const {
  pingController,
  getVideosFromPlaylist,
} = require("../controllers/controller");

const apiRoutes = express.Router();

apiRoutes.get("/", pingController);
apiRoutes.post("/get-videos-from-playlist", getVideosFromPlaylist);

module.exports = apiRoutes;
