const express = require("express");
const router = express.Router();

router.use("/image", require("./image.router"));
router.use("/api", require("./user.router"));
router.use("/auth", require("./user.router"));

module.exports = router;
