import HeadTags from "./HeadTags";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import Search from "./SearchComponent";
import { createRef } from "react";
import {
  Container,
  Ref,
  Grid,
  Sticky,
  Segment,
  Visibility,
} from "semantic-ui-react";

//! V this is for the nprogress bar
import nprogress from "nprogress";
import Router from "next/router";

const Layout = ({ children, user }) => {
  Router.onRouteChangeStart = () => nprogress.start();
  Router.onRouteChangeComplete = () => nprogress.done();
  Router.onRouteChangeError = () => nprogress.done();

  //createRef will update the reference on re-render
  //useRef will only update on refresh
  const contextRef = createRef();

  return (
    <>
      <HeadTags />
      {user ? (
        <>
          <div
            style={{
              marginLeft: "1rem",
              marginRight: "1rem",
            }}
          >
            <Ref innerRef={contextRef}>
              <Grid>
                <Grid.Column floated="left" width={3}>
                  <Sticky context={contextRef}>
                    <SideMenu user={user} />
                  </Sticky>
                </Grid.Column>
                <Grid.Column width={9}>
                  <Visibility context={contextRef}>{children}</Visibility>
                </Grid.Column>
                <Grid.Column floated="left" width={4}>
                  <Sticky context={contextRef}>
                    <Segment basic>
                      <Search />
                    </Segment>
                  </Sticky>
                </Grid.Column>
              </Grid>
            </Ref>
          </div>
        </>
      ) : (
        <>
          <Navbar />
          <Container text>{children}</Container>
        </>
      )}
    </>
  );
};

export default Layout;
