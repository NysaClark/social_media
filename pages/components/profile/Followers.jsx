import { useState, useEffect } from "react";
import { Button, Image, List } from "semantic-ui-react";
import Spinner from "../layout/Spinner";
import { NoFollowData } from "../layout/NoData";
import { followUser, unfollowUser } from "../../util/profileActions";
import axios from "axios";
import { baseURL } from "../../util/baseURL";
import Cookies from "js-cookie";

const Followers = ({
  user,
  loggedUserFollowStats,
  setLoggedUserFollowStats,
  profileUserId,
}) => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const getFollowers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${baseURL}/api/v1/profile/followers/${profileUserId}`,
          {
            headers: { Authorization: `Bearer ${Cookies.get("token")}` },
          }
        );
        setFollowers(res.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    getFollowers();
  }, []);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : followers.length? (
        followers.map((follower) => {
          const isFollowing = loggedUserFollowStats.following.some(
            (each) => each.user === follower.user._id
          );

          return (
            <List key={follower.user._id} divided verticalAlign="middle">
              <List.Item>
                <List.Content floated="right">
                  {follower.user._id !== user._id && (
                    <Button
                      color={isFollowing ? "instagram" : "twitter"}
                      icon={isFollowing ? "check" : "add user"}
                      content={isFollowing ? "Following" : "Follow"}
                      disabled={followLoading}
                      onClick={async () => {
                        setFollowLoading(true);
                        isFollowing
                          ? await unfollowUser(
                              follower.user._id,
                              setLoggedUserFollowStats
                            )
                          : await followUser(
                              follower.user._id,
                              setLoggedUserFollowStats
                            );
                        setFollowLoading(false);
                      }}
                    />
                  )}
                </List.Content>
                <Image avatar src={follower.user.profilePicURL} />
                <List.Content as="a" href={`/${follower.user.username}`}>
                  {follower.user.name}
                </List.Content>
              </List.Item>
            </List>
          );
        })
      ) : (
        <NoFollowData followersComponent={true} profileName={user.name} />
      )}
    </>
  );
};

export default Followers;
