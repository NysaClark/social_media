import Layout from "./components/layout/Layout";
import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";
import { redirectUser } from "./util/authUser";
import { parseCookies, destroyCookie } from "nookies";
import { baseURL } from "./util/baseURL";
import axios from "axios";

const MyApp = ({ Component, pageProps }) => {
  // function MyApp(appContext) {
  //   console.log(appContext);
  //   const { Component, pageProps } = appContext;
  return (
    <Layout user={pageProps.user}>
      <Component {...pageProps} />
    </Layout>
  );
};

MyApp.getInitialProps = async ({ ctx, Component }) => {
  const { token } = parseCookies(ctx);
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  const protectedRoutes = ["/", "/[username]"];
  const isProtectedRoute = protectedRoutes.includes(ctx.pathname);

  if (!token) {
    isProtectedRoute && redirectUser(ctx, "/login");
  } else {
    try {
      const res = await axios.get(`${baseURL}/api/v1/auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { user, followData } = res.data;

      if (user) !isProtectedRoute && redirectUser(ctx, "/");

      pageProps.user = user;
      pageProps.followData = followData;
    } catch (error) {
      destroyCookie(ctx, "token");
      redirectUser(ctx, "/login");
    }
  }
  return { pageProps };
};

export default MyApp;
