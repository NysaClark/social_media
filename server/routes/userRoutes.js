const router = require("express").Router();

const {
  createUser,
  getUsernameAvailable,
  postUserLogin,
} = require("../controllers/user");

router.route("/signup").post(createUser);
router.route("/login").post(postUserLogin);
router.route("/:username").get(getUsernameAvailable);

module.exports = router;
