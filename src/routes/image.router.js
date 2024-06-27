const express = require("express");
const { getImage } = require("../controllers/image.controller");
const router = express.Router();

router.route("/getImage/:fileName").get(getImage);

module.exports = router;
