import {useState} from 'react';
import {Form, Segment} from 'semantic-ui-react';

const MessagesInputField = ({sendMsg}) => {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  return (
    <div style={{ position: "sticky", bottom: "0"}}>
      <Segment secondary color='purple' attached="bottom">
        <Form reply onSubmit={(e) => {
          e.preventDefault();
          sendMsg(text)
          setText("")
        }}>
          <Form.Input
            size='large'
            placeholder="Send Message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            action={{
              color: "purple",
              icon: "telegram plane",
              disabled: text === "",
              loading: loading
            }}
          />  
        </Form>
      </Segment>  
    </div>
  )
}

export default MessagesInputField