import { Button, Divider, Form, Message } from "semantic-ui-react";

const CommonSocials = ({
  user: { facebook, twitter, instagram, youtube },
  handleChange,
  showSocialLinks,
  setShowSocialLinks,
}) => {
  return (
    <>
      <Button
        content="Add Social Links"
        color="blue"
        icon="at"
        type="button"
        onClick={() => setShowSocialLinks(!showSocialLinks)}
      />

      {showSocialLinks && (
        <>
          <Divider />
          <Message
            icon="attention"
            info
            size="tiny"
            header="Social Medial Links Are Optional!!!"
          />

          <Form.Input
            icon="facebook f"
            iconPosition="left"
            placeholder="Facebook"
            name="facebook"
            value={facebook}
            onChange={handleChange}
          />
          <Form.Input
            icon="twitter"
            iconPosition="left"
            placeholder="Twitter"
            name="twitter"
            value={twitter}
            onChange={handleChange}
          />
          <Form.Input
            icon="instagram"
            iconPosition="left"
            placeholder="Instagram"
            name="instagram"
            value={instagram}
            onChange={handleChange}
          />
          <Form.Input
            icon="youtube"
            iconPosition="left"
            placeholder="YouTube"
            name="youtube"
            value={youtube}
            onChange={handleChange}
          />
        </>
      )}
    </>
  );
};

export default CommonSocials;
