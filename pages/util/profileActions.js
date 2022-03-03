import axios from "axios";
import { baseURL } from "./baseURL";
import catchErrors from "./catchErrors";
import Cookies from "js-cookie";
import Router from "next/router";

const profileAxios = axios.create({
  baseURL: `${baseURL}/api/v1/profile`,
  headers: { Authorization: `Bearer ${Cookies.get("token")}` },
});

export const followUser = async (userToFollowId, setUserFollowStats) => {
  try {
    await profileAxios.post(`/follow/${userToFollowId}`);

    setUserFollowStats((prev) => ({
      ...prev,
      following: [...prev.following, { user: userToFollowId }],
    }));
  } catch (error) {
    console.log(error);
  }
};
export const unfollowUser = async (userToUnfollowId, setUserFollowStats) => {
  try {
    await profileAxios.post(`/unfollow/${userToUnfollowId}`);

    setUserFollowStats((prev) => ({
      ...prev,
      following: prev.following.filter(
        (following) => following.user !== userToUnfollowId
      ),
    }));
  } catch (error) {
    console.log(error);
  }
};
