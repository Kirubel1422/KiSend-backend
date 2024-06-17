const express = require("express");
const { getImage } = require("../controllers/image.controller");
const imageRouter = express.Router();

imageRouter.get("/getImage/:fileName", getImage);

module.exports = {
  imageRouter,
};
