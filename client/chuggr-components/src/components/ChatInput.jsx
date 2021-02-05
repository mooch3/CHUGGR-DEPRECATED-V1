import {React, useState} from 'react';


function ChatInput(props){
    const [message, setMessage] = useState("");

    function handleSend(event){
        const { value } = event.target;
        setMessage(value)
    }
    function handleKeyPress(event){
        if (event.key === 'Enter'){
        {props.sendEnterMessage(message)
        setMessage("")}
        }
    }

    return(
        <div className="chat-input-holder">
            <input  type="text" className="chat-input" id="chatValue" 
            onChange={handleSend} value={message} autoComplete="off"
            onKeyPress={handleKeyPress}
            />
            <input type="submit" className="message-send" 
            onClick={() => {props.sendMessage(message);
            setMessage("");
            }}
            /> 
        </div>
    );
}

export default ChatInput