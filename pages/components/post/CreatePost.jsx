import React, { useState, useRef } from "react";
import { Form, Button, Image, Divider, Message, Icon } from "semantic-ui-react";
import { submitNewPost } from "../../util/postActions";
import axios from "axios";

const CreatePost = ({ user, setPosts }) => {
  //*STATES */
  const [newPost, setNewPost] = useState({ text: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [highlighted, setHighlighted] = useState(false);
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const inputRef = useRef();

  //*HANDLERS */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "media" && files.length) {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]));
    } else {
      setNewPost((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let picUrl;

    if (media) {
      const formData = new FormData();
      formData.append("image", media, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const res = await axios.post("/api/v1/uploads", formData);
      picUrl = res.data.src;
    }
    await submitNewPost(
      newPost.text,
      newPost.location,
      picUrl,
      setPosts,
      setNewPost,
      setError
    );

    setMedia(null);
    setMediaPreview(null);
    setLoading(false);
  };

  const addStyles = () => ({
    textAlign: "center",
    height: "150px",
    width: "150px",
    border: "dotted",
    paddingTop: media === null && "60px",
    cursor: "pointer",
    borderColor: highlighted ? "green" : "black",
  });

  return (
    <Form error={error !== null} onSubmit={handleSubmit}>
      <Message
        error
        content={error}
        onDismiss={() => setError(null)}
        header="Oops"
      />
      <Form.Group>
        <Image src={user.profilePicURL} avatar inline />
        <Form.TextArea
          placeholder="what's happening?"
          name="text"
          value={newPost.text}
          onChange={handleChange}
          rows={4}
          width={14}
        />
      </Form.Group>
      <Form.Group>
        <Form.Input
          value={newPost.location}
          name="location"
          onChange={handleChange}
          label="Add Location"
          icon="map marker alternate"
          placeholder="Where?"
        />
        <input
          ref={inputRef}
          name="media"
          onChange={handleChange}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
        />
      </Form.Group>
      <div
        style={addStyles()}
        onClick={() => inputRef.current.click()}
        onDrag={(e) => {
          e.preventDefault();
          setHighlighted(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setHighlighted(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setHighlighted(true);

          const droppedFile = Array.from(e.dataTransfer.files);

          setMedia(droppedFile[0]);
          setMediaPreview(URL.createObjectURL(droppedFile[0]));
        }}
      >
        {media === null ? (
          <Icon name="plus" size="big" />
        ) : (
          <Image
            style={{ height: "150px", width: "150px", objectFit: "contain" }}
            src={mediaPreview}
            alt="post image"
            centered
            size="medium"
          />
        )}
      </div>
      <Divider hidden />
      <Button
        loading={loading}
        circular
        disabled={newPost.text === "" || loading}
        color="purple"
        icon="send"
        content={<strong>Post</strong>}
      />
    </Form>
  );
};

export default CreatePost;
