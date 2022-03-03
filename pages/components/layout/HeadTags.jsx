//rafce
import Head from "next/head";

const HeadTags = () => {
  return (
    <Head>
      <title>Social Media App</title>

      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content="An example Social Media App" />
      <meta charSet="UTF-8" />

      <link rel="icon" href="/favicon.ico" />

      <link rel="stylesheet" href="/styles.css" />
      <link rel="stylesheet" href="/nprogress.css" />
    </Head>
  );
};

export default HeadTags;
