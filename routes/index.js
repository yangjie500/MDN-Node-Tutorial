var express = require('express');
var router = express.Router();

// GET home page.
router.get('/', function(req, res, next) {
  res.redirect('/catalog');
});

router.get("/test", (req, res) => {
  res.render("test", { title: "Hello World" })
})

module.exports = router;
