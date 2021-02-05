import {React} from 'react'

function Message(props){
    return (
        <div className="message-box-holder">
            <div className="message-box">{props.message}</div>
            <div className="message-sender">Sender</div>
        </div>
    )
}

export default Message