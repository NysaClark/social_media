import { useState, useEffect } from "react";
import { Button, Image, List } from "semantic-ui-react";
import Spinner from "../layout/Spinner";
import { NoFollowData } from "../layout/NoData";
import { followUser, unfollowUser } from "../../util/profileActions";
import axios from "axios";
import { baseURL } from "../../util/baseURL";
import Cookies from "js-cookie";

const Following = ({
  user,
  loggedUserFollowStats,
  setLoggedUserFollowStats,
  profileUserId,
}) => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const getFollowing = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${baseURL}/api/v1/profile/following/${profileUserId}`,
          {
            headers: { Authorization: `Bearer ${Cookies.get("token")}` },
          }
        );
        setFollowing(res.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    getFollowing();
  }, []);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : following.length ? (
        following.map((follow) => {
          const isFollowing = loggedUserFollowStats.following.some(
            (each) => each.user === follow.user._id
          );

          return (
            <List key={follow.user._id} divided verticalAlign="middle">
              <List.Item>
                <List.Content floated="right">
                  {follow.user._id !== user._id && (
                    <Button
                      color={isFollowing ? "instagram" : "twitter"}
                      icon={isFollowing ? "check" : "add user"}
                      content={isFollowing ? "Following" : "Follow"}
                      disabled={followLoading}
                      onClick={async () => {
                        setFollowLoading(true);
                        isFollowing
                          ? await unfollowUser(
                              follow.user._id,
                              setLoggedUserFollowStats
                            )
                          : await followUser(
                              follow.user._id,
                              setLoggedUserFollowStats
                            );
                        setFollowLoading(false);
                      }}
                    />
                  )}
                </List.Content>
                <Image avatar src={follow.user.profilePicURL} />
                <List.Content as="a" href={`/${follow.user.username}`}>
                  {follow.user.name}
                </List.Content>
              </List.Item>
            </List>
          );
        })
      ) : (
        <NoFollowData followingComponent={true} profileName={user.name} />
      )}
    </>
  );
};

export default Following;
