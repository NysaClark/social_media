import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { baseURL } from "./util/baseURL";
import { parseCookies } from "nookies";
import Cookies from "js-cookie";
import { Segment, Header, Divider, Comment, Grid } from "semantic-ui-react";
import { useRouter } from "next/router";
import Banner from "./components/messages/Banner";

const scrollDivToBottom = (divRef) =>
  divRef.current !== null &&
  divRef.current.scrollIntoView({ behavior: "smooth" });

const messages = ({ chatsData, user }) => {
  const [chats, setChats] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [bannerData, setBannerData] = useState({ name: "", profilePicURL: "" });

  const router = useRouter();
  const socket = useRef();
  const divRef = useRef();
  const openChatId = useRef("");

  const deleteChat = async (messagesWith) => {
    try {
      await axios.delete(`${baseURL}/api/v1/messages/${messagesWith}`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });
      setChats((prev) =>
        prev.filter((chat) => chat.messagesWith !== messagesWith)
      );
      router.push("/messages", undefined, { shallow: true });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Segment padded basic size="large" style={{ marginTop: "1rem" }}>
      <Header
        icon="home"
        content="Go Back"
        onClick={() => {
          router.push("/");
        }}
        style={{ cursor: "pointer" }}
      />
      <Divider hidden />
      <div style={{ marginBottom: "1rem" }}>
        <p>Chat List Search Component</p>
      </div>
      {chats.length > 0 ? (
        <Grid stackable>
          <Grid.Column width={4}>
            <Comment.Group size="big">
              <Segment raised style={{ overflow: "auto", maxHeight: "32rem" }}>
                {chats.map((chat, i) => (
                  <p>Chat Component</p>
                ))}
              </Segment>
            </Comment.Group>
          </Grid.Column>
          <Grid.Column width={12}>
            {router.query.message && (
              <>
                <div
                  style={{
                    overflow: "auto",
                    overflowX: "hidden",
                    maxHeight: "35rem",
                    height: "35rem",
                    backgroundColor: "whitesmoke",
                  }}
                >
                  <div>
                    <Banner bannerData={bannerData} />
                  </div>

                  {messages.length > 0 &&
                    messages.map((message, i) => <p>Message Component</p>)}
                </div>
                <p>Message Input Field Component</p>
              </>
            )}
          </Grid.Column>
        </Grid>
      ) : (
        <h1>No Messages Yet</h1>
      )}
    </Segment>
  );
};

messages.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);
    const res = await axios.get(`${baseURL}/api/v1/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { chatsData: res.data };
  } catch (error) {
    console.log(error);
    return { errorLoading: true };
  }
};

export default messages;
