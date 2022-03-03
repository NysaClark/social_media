const {
  getProfile,
  getUserPosts,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
} = require("../controllers/profile");

const router = require("express").Router();

router.route("/:username").get(getProfile);
router.route("/posts/:username").get(getUserPosts);
router.route("/followers/:userId").get(getFollowers);
router.route("/following/:userId").get(getFollowing);
router.route("/follow/:userToFollowId").post(followUser);
router.route("/unfollow/:userToUnfollowId").post(unfollowUser);

module.exports = router;
