import { Form, Header, Icon, Image, Segment } from "semantic-ui-react";

const ImageDropDiv = ({
  handleChange,
  inputRef,
  setHightlighted,
  highlighted,
  setMedia,
  setMediaPreview,
  media,
  mediaPreview,
}) => {
  return (
    <>
      <Form.Field>
        <Segment placeholder basic secondary>
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            name="media"
            style={{ display: "none" }}
            ref={inputRef}
          />
          <div
            onClick={() => {
              inputRef.current.click();
            }}
            style={{ cursor: "pointer" }}
            onDragOver={(e) => {
              e.preventDefault();
              setHightlighted(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setHightlighted(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setHightlighted(true);
              // console.log(e.dataTransfer.files);
              const droppedFile = e.dataTransfer.files[0];
              setMediaPreview(URL.createObjectURL(droppedFile));
              setMedia(droppedFile);
            }}
          >
            {mediaPreview === null ? (
              <Segment
                basic
                placeholder
                style={{ cursor: "pointer" }}
                {...(highlighted && { color: "green" })}
              >
                <Header icon>
                  <Icon name="file image outline" />
                  Drag & Drop or Click to Upload
                </Header>
              </Segment>
            ) : (
              <Segment placeholder basic color="green">
                <Image
                  src={mediaPreview}
                  size="small"
                  centered
                  style={{ cursor: "pointer" }}
                />
              </Segment>
            )}
          </div>
        </Segment>
      </Form.Field>
    </>
  );
};

export default ImageDropDiv;
