import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { baseURL } from "./util/baseURL";
import { parseCookies } from "nookies";
import Cookies from "js-cookie";
import { Segment, Header, Divider, Comment, Grid } from "semantic-ui-react";
import { useRouter } from "next/router";
import Banner from "./components/messages/Banner";
import ChatListSearch from "./components/messages/ChatListSearch";
import Chat from "./components/messages/Chat";
import MessagesInputField from "./components/messages/MessagesInputField";
import Message from "./components/messages/Message";

const scrollDivToBottom = (divRef) =>
  divRef.current !== null &&
  divRef.current.scrollIntoView({ behavior: "smooth" });

const messages = ({ chatsData, user }) => {
  const [chats, setChats] = useState(chatsData);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [bannerData, setBannerData] = useState({ name: "", profilePicURL: "" });

  const router = useRouter();
  const socket = useRef();
  const divRef = useRef();

  const openChatId = useRef("");

  useEffect(() => {
    const startServer = async () => {
      await fetch("/api/socket");
      socket.current = io();

      socket.current.on("connect", () => {
        console.log("connected");
      });
      // socket.current.on("ping", (data) => {
      //   console.log(data);
      //   socket.current.emit('testing', {userId: user._id});
      // });

      socket.current.on("connectedUsers", ({ users }) => {
        users.length > 0 && setConnectedUsers(users);
      });

      socket.current.emit("join", { userId: user._id });
    };
    startServer();
  }, []);

  useEffect(() => {
    const loadMessages = () => {
      socket.current.emit("loadMessages", {
        userId: user._id,
        messagesWith: router.query.message,
      });

      socket.current.on("messagesLoaded", async ({ chat }) => {
        setMessages(chat.messages);
        setBannerData({
          name: chat.messagesWith.name,
          profilePicURL: chat.messagesWith.profilePicURL,
        });
        openChatId.current = chat.messagesWith._id;
        divRef.current && scrollDivToBottom(divRef);
      });

      socket.current.on("noChatFound", async () => {
        try {
          const res = await axios.get(
            `${baseURL}/api/v1/messages/user/${router.query.message}`,
            {
              headers: { Authorization: `Bearer ${Cookies.get("token")}` },
            }
          );
          setBannerData({
            name: res.data.name,
            profilePicURL: res.data.profilePicURL,
          });
          setMessages([]);
          openChatId.current = router.query.message;
        } catch (error) {
          console.log(error);
        }
      });
    };
    if (socket.current && router.query.message) loadMessages();
  }, [router.query.message]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msgSent", ({ newMsg }) => {
        if (newMsg.receiver === openChatId.current) {
          setMessages((prev) => [...prev, newMsg]);

          setChats((prev) => {
            const previousChat = prev.find(
              (chat) => chat.messagesWith === newMsg.receiver
            );
            previousChat.lastMessage = newMsg.msg;
            previousChat.date = newMsg.date;

            return [...prev];
          });
        }
      });
      socket.current.on("newMsgReceived", async ({ newMsg }) => {
        let senderName;
        if (newMsg.sender === openChatId.current) {
          setMessages((prev) => [...prev, newMsg]);

          setChats((prev) => {
            const previousChat = prev.find(
              (chat) => chat.messagesWith === newMsg.receiver
            );
            previousChat.lastMessage = newMsg.msg;
            previousChat.date = newMsg.date;

            return [...prev];
          });
        } else {
          const isPreviouslyMessaged = chats.some(
            (chat) => chat.messagesWith === newMsg.sender
          );

          if (isPreviouslyMessaged) {
            setChats((prev) => {
              const previousChat = prev.find(
                (chat) => chat.messagesWith === newMsg.receiver
              );
              previousChat.lastMessage = newMsg.msg;
              previousChat.date = newMsg.date;

              senderName = previousChat.name;

              return [
                previousChat,
                ...prev.filter((chat) => chat.messagesWith !== newMsg.sender),
              ];
            });
          } else {
            const res = await axios.get(
              `${baseURL}/api/v1/messages/user/${router.query.message}`,
              {
                headers: { Authorization: `Bearer ${Cookies.get("token")}` },
              }
            );

            const {name, profilePicURL} = res.data;
            senderName = name;

            const newChat = {
              messagesWith: newMsg.sender,
              name,
              profilePicURL,
              lastMessage: newMsg.msg,
              date: newMsg.date,
            };

            setChats((prev) => [newChat, ...prev]);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    messages.length > 0 && scrollDivToBottom(divRef);
  }, [messages]);
  

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

  const sendMsg = (msg) => {
    socket.current.emit("sendNewMsg", {
      userId: user._id,
      msgSendToUserId: openChatId.current,
      msg,
    });
  };

  const deleteMsg = (messageId) => {
    if (socket.current) {
      socket.current.emit("deleteMsg", {
        userId: user._id,
        messagesWith: openChatId.current,
        messageId,
      });

      socket.current.on("msgDeleted", () => {
        setMessages((prev) =>
          prev.filter((message) => message._id !== messageId)
        );
      });
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
        <ChatListSearch chats={chats} setChats={setChats} />
      </div>
      {console.log(chats)}
      {chats.length > 0 ? (
        <Grid stackable>
          <Grid.Column width={12}>
            <Comment.Group size="big">
              <Segment raised style={{ overflow: "auto", maxHeight: "32rem" }}>
                {chats.map((chat, i) => (
                  <Chat
                    key={i}
                    chat={chat}
                    connectedUsers={connectedUsers}
                    deleteChat={deleteChat}
                  />
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
                    messages.map((message, i) => (
                      <Message
                        key={i}
                        message={message}
                        user={user}
                        deleteMsg={deleteMsg}
                        bannerProfilePic={bannerData.profilePicURL}
                        divRef={divRef}
                      />
                    ))}
                </div>
                <MessagesInputField sendMsg={sendMsg} />
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
