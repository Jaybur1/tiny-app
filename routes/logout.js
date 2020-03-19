const express = require("express");
const router = express.Router();

/* handle logout*/
router.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

module.exports = router;
