import { useState } from "react";
import { List, Image, Search, Item } from "semantic-ui-react";
import axios from "axios";
import Cookies from "js-cookie";
import Router from "next/router";
import { baseURL } from "../../util/baseURL";
let cancel;

const SearchComponent = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  //*handlers */

  const handleChange = async (e) => {
    const { value } = e.target;
    if (value === " ") return;
    setText(value);
    if (value) {
      setLoading(true);
      try {
        cancel && cancel();
        const token = Cookies.get("token");
        const res = await axios.get(`${baseURL}/api/v1/search/${value}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cancelToken: new axios.CancelToken((canceler) => {
            cancel = canceler;
          }),
        });

        if (res.data.length === 0) {
          setResults([]);
          return setLoading(false);
        }
        setResults(res.data);
      } catch (error) {
        console.log("Error Searching", error);
      }
    } else {
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <Search
      onBlur={() => {
        results.length > 0 && setResults([]);
        loading && setLoading(false);
        setText("");
      }}
      loading={loading}
      value={text}
      resultRenderer={ResultRenderer}
      results={results || null}
      onSearchChange={handleChange}
      placeholder="Find other users"
      minCharacters={1}
      onResultSelect={(e, data) => Router.push(`/${data.result.username}`)}
    />
  );
};

const ResultRenderer = ({ _id, profilePicURL, name }) => {
  return (
    <List key={_id}>
      <List.Item>
        <Image
          style={{
            objectFit: "contain",
            height: "1.5rem",
            width: "1.5rem",
          }}
          src={profilePicURL}
          alt="ProfilePic"
          avatar
        />
        <Item.Content header={name} as="a" />
      </List.Item>
    </List>
  );
};

export default SearchComponent;
