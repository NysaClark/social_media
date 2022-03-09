import {
  Card,
  Icon,
  Image,
  Divider,
  Segment,
  Button,
  Popup,
  Header,
} from "semantic-ui-react";
import { deletePost, likePost } from "../../util/postActions";
import calculateTime from "../../util/calculateTime";
import PostComments from "./PostComments";
import Link from "next/link";
import CommentInputField from "./CommentInputField";
import LikesList from "./LikesList";

const NoImageModal = ({
  post,
  user,
  likes,
  setLikes,
  isLiked,
  comments,
  setComments,
}) => {
  return (
    <Segment basic>
      <Card fluid color="purple">
        <Card.Content>
          <Image floated="left" src={post.user.profilePicURL} avatar circular />
          {(user.role === "root" || post.user_id === user._id) && (
            <>
              <Popup
                on="click"
                position="top right"
                trigger={
                  <Image
                    src="/deleteIcon.svg"
                    style={{ cursor: "pointer" }}
                    size="mini"
                    floated="right"
                  />
                }
              >
                <Header as="h4" content="Are you sure?" />
                <p>This action is irreversable</p>

                <Button
                  color="red"
                  icon="trash"
                  content="Delete"
                  onClick={() => deletePost(post._id, setPosts, setShowToastr)}
                />
              </Popup>
            </>
          )}
          <Card.Header>
            <Link href={`/${post.user.username}`}>
              <a>{post.user.name}</a>
            </Link>
          </Card.Header>
          <Card.Meta>{calculateTime(post.createdAt)}</Card.Meta>
          {post.location && <Card.Meta content={post.location} />}
          <Card.Description
            style={{
              fontSize: "17px",
              letterSpacing: "0.1px",
              wordSpacing: "0.35px",
            }}
          >
            {post.text}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Icon
            name={isLiked ? "heart" : "heart outline"}
            color={isLiked ? "red" : undefined}
            style={{ cursor: "pointer" }}
            onClick={() => likePost(post._id, user._id, setLikes, !isLiked)}
          />
          <LikesList
            postId={post._id}
            trigger={
              likes && (
                <span className="spanLikesList">
                  {`${likes.length} ${likes.length === 1 ? "like" : "likes"}`}
                </span>
              )
            }
          />
          <Icon
            name="comment outline"
            style={{ marginLeft: "7px" }}
            color="blue"
          />
          {comments &&
            comments.map((comment) => (
              <PostComments
                key={comment._id}
                comment={comment}
                postId={post._id}
                user={user}
                setComments={setComments}
              />
            ))}
          <Divider hidden />
          <CommentInputField
            user={user}
            postId={post._id}
            setComments={setComments}
          />
        </Card.Content>
      </Card>
    </Segment>
  );
};

export default NoImageModal;
