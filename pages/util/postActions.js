import axios from "axios";
import { baseURL } from "./baseURL";
import Cookies from "js-cookie";
import catchErrors from "./catchErrors";

const postAxios = axios.create({
  baseURL: `${baseURL}/api/v1/posts`,
  headers: { Authorization: `Bearer ${Cookies.get("token")}` },
});

export const deletePost = async (postId, setPosts, setShowToastr) => {
  try {
    await postAxios.delete(`/${postId}`);
    setPosts((prev) => prev.filter((post) => post._id !== postId));
    setShowToastr(true);
  } catch (error) {
    console.log(catchErrors(error));
  }
};

export const likePost = async (postId, userId, setLikes, like = true) => {
  try {
    if (like) {
      await postAxios.post(`/like/${postId}`);
      setLikes((prev) => [...prev, { user: userId }]);
    } else {
      await postAxios.put(`/like/${postId}`);
      setLikes((prev) => prev.filter((like) => like.user !== userId));
    }
  } catch (error) {
    console.log(catchErrors(error));
  }
};

export const deleteComment = async (postId, commentId, setComments) => {
  try {
    await postAxios.delete(`/comment/${postId}/${commentId}`);
    setComments((prev) => prev.filter((comment) => comment._id !== commentId));
  } catch (error) {
    console.log(catchErrors(error));
  }
};

export const postComment = async (postId, user, text, setComments, setText) => {
  try {
    const res = await postAxios.post(`/comment/${postId}`, { text });
    const newComment = {
      _id: res.data,
      user,
      text,
      date: Date.now(),
    };

    setComments((prev) => [newComment, ...prev]);
    setText("");
  } catch (error) {
    console.log(catchErrors(error));
  }
};

export const submitNewPost = async (
  text,
  location,
  picUrl,
  setPosts,
  setNewPost,
  setError
) => {
  try {
    const res = await postAxios.post("/", { text, location, picUrl });
    setPosts((prev) => [res.data, ...prev]);
    setNewPost({ text: "", location: "" });
  } catch (error) {
    console.log(error);
    setError(catchErrors(error));
  }
};
