import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { baseURL } from "./util/baseURL";
import { parseCookies } from "nookies";
import Cookies from "js-cookie";
import CardPost from "./components/post/CardPost";
import { Grid, Placeholder } from "semantic-ui-react";
import ProfileMenuTabs from "./components/profile/ProfileMenuTabs";
import ProfileHeader from "./components/profile/ProfileHeader";
import { NoProfilePosts } from "./components/layout/NoData";
import { PlaceHolderPosts } from "./components/layout/PlaceHolderGroup";
import Followers from "./components/profile/Followers";
import Following from "./components/profile/Following";

const ProfilePage = ({
  errorLoading,
  profile,
  followersLength,
  followingLength,
  user,
  followData,
}) => {
  const router = useRouter();
  const { username } = router.query;
  const ownAccount = profile.user._id === user._id;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeItem, setActiveItem] = useState("profile");
  const [loggedUserFollowStats, setLoggedUserFollowStats] =
    useState(followData);

  const handleItemClicked = (clickedTab) => setActiveItem(clickedTab);

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      try {
        const { username } = router.query;
        const res = await axios.get(
          `${baseURL}/api/v1/profile/posts/${username}`,
          {
            headers: { Authorization: `Bearer ${Cookies.get("token")}` },
          }
        );
        setPosts(res.data);
      } catch (error) {
        console.log("error loading posts");
      }
      setLoading(false);
    };
    getPosts();
  }, [router.query.username]);

  return (
    <>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column>
            <ProfileMenuTabs
              activeItem={activeItem}
              handleItemClick={handleItemClicked}
              followersLength={followersLength}
              followingLength={followingLength}
              ownAccount={ownAccount}
              loggedUserFollowStats={loggedUserFollowStats}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            {activeItem === "profile" && (
              <>
                <ProfileHeader
                  profile={profile}
                  ownAccount={ownAccount}
                  loggedUserFollowStats={loggedUserFollowStats}
                  setLoggedUserFollowStats={setLoggedUserFollowStats}
                />
                {loading ? (
                  <PlaceHolderPosts />
                ) : posts ? (
                  posts.map((post) => {
                    return (
                      <CardPost
                        key={post._id}
                        post={post}
                        user={user}
                        setPosts={setPosts}
                      />
                    );
                  })
                ) : (
                  <NoProfilePosts />
                )}
              </>
            )}
            {activeItem === "followers" && (
              <Followers
                user={user}
                loggedUserFollowStats={loggedUserFollowStats}
                setLoggedUserFollowStats={setLoggedUserFollowStats}
                profileUserId={profile.user._id}
              />
            )}
            {activeItem === "following" && (
              <Following
                user={user}
                loggedUserFollowStats={loggedUserFollowStats}
                setLoggedUserFollowStats={setLoggedUserFollowStats}
                profileUserId={profile.user._id}
              />
            )}
            {activeItem === "updateProfile" && (
              <UpdateProfile profile={profile} />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};

ProfilePage.getInitialProps = async (ctx) => {
  try {
    const { username } = ctx.query;
    const { token } = parseCookies(ctx);
    const res = await axios.get(`${baseURL}/api/v1/profile/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { profile, followersLength, followingLength } = res.data;
    return { profile, followersLength, followingLength };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default ProfilePage;
