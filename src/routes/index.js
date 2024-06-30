const express = require("express");
const router = express.Router();

router.use("/image", require("./image.router"));
router.use("/auth", require("./auth.router"));
router.use("/api", require("./follow.router"));
router.use("/api", require("./user.router"));

module.exports = router;
