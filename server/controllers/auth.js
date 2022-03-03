const UserModel = require("../models/UserModel");
const FollowerModel = require("../models/FollowerModel");

const getUserAuth = async (req, res) => {
  const { userId } = req;

  if (!userId) return res.status(500).send("No User ID");
  try {
    const user = await UserModel.findById(userId);
    const followData = await FollowerModel.findOne({ user: userId });

    return res.status(200).json({ user, followData });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error in auth controller");
  }
};

module.exports = { getUserAuth };
