import { range } from "lodash";
import { Placeholder, Divider } from "semantic-ui-react";

export const LikesPlaceHolder = () =>
  range(1, 6).map((item) => (
    <Placeholder key={item} style={{ minWidth: "200px" }}>
      <Placeholder.Header image>
        <Placeholder.Line length="full" />
      </Placeholder.Header>
    </Placeholder>
  ));

export const PlaceHolderPosts = () => {
  return range(1, 3).map((item) => (
    <>
      <Placeholder key={item} fluid>
        <Placeholder.Header image>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
        <Placeholder.Paragraph>
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Paragraph>
      </Placeholder>
      <Divider hidden/>
    </>
  ));
};
