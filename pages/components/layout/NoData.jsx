import { Message, Button } from "semantic-ui-react";

export const NoProfilePosts = () => {
  return (
    <>
      <Message
        info
        icon="meh"
        header="Sorry!"
        content="User has not posted yet."
      />
      <Button
        icon="long arrow alternate left"
        content="Go Back"
        as="a"
        href="/"
      />
    </>
  );
};

export const NoFollowData = ({
  profileName,
  followersComponent = false,
  followingComponent = false,
}) => {
  return (
    <>
      {followersComponent && (
        <Message
          icon="user outline"
          info
          content={`${profileName.split(" ")[0]} does not have followers`}
        />
      )}
      {followingComponent && (
        <Message
          icon="user outline"
          info
          content={`${profileName.split(" ")[0]} isn't following anyone`}
        />
      )}
    </>
  );
};

export const NoMessages = () =>(
    <Message
      info
      icon="telegram plane"
      header="Sorry!"
      content="You do not have any messages. Search above to find a friend"
    />
  );


export const NoPosts = () => (
  <Message
    info
    icon="meh"
    header="Hey!"
    content="No posts. Make sure you follow someone!"
  />
);
