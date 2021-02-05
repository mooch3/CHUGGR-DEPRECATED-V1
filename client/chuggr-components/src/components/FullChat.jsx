import {useState, useEffect, useRef} from 'react';
import ChatInput from './ChatInput'
import Message from './Message'
import ChatboxHeader from './ChatboxHeader'


function FullChat(){
  const [chat, setChat] = useState([]);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chat]);

    function handleClick(input){
      setChat(prevValues => { return [...prevValues, input]})
    }
    return (
    <div>
     <div className="chatbox group-chat">
        <ChatboxHeader />
         <div className="chat-messages" id="chat-message-container">
         {chat.map((message, index) => (
           <Message 
             key = {index}
             message = {message}
           />
           ))}
           <div ref={messagesEndRef} />
         </div>
       </div>
      <ChatInput sendMessage = {handleClick} sendEnterMessage = {handleClick} />     
    </div>
    )
}


export default FullChat;