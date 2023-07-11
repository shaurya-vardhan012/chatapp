import React, { useRef } from 'react'
import { useLocation } from 'react-router-dom';
import Moment from 'react-moment';  
import { io } from 'socket.io-client';


const ChatRoom = () => {

    const location = useLocation();
    const msgBoxRef = useRef();


    const [data, setData] = React.useState({});
    const [message, setMessage] = React.useState("");
    const [allmsg, setAllmsg] = React.useState([]);
    const [socket, setSocket] = React.useState();


    React.useEffect(() => {
        const socket = io("http://localhost:3001");
        setSocket(socket);

        socket.on("connect", () => {
            socket.emit("joinRoom",location.state.room)
        }); 
    }, []);

    React.useEffect(() => {
        setData(location.state);
    }, [location]);


    React.useEffect(() => {
        if (socket)
        {
            socket.on("getLatestMessage", (newMessage) => {
              // console.log(newMessage);
                setAllmsg([...allmsg, newMessage]);
                msgBoxRef.current.scrollIntoView({behaviour:"smooth"})
                setMessage('');
            });
        }
    }, [socket, allmsg]);
    const submitHandle = (e) => {
        if (message)
        {
            const newMessage = { time: new Date(), message, name: data.name };
            socket.emit("newMessage", { newMessage, room:data.room});
        }
        // setAllmsg([...allmsg, newMessage]);
        // console.log(allmsg);
    }

    const handleEnter = (e) => (e.keyCode === 13 ? submitHandle() : "");
  return (
      <div className='py-4 m-5 w-50 shadow bg-white text-dark border rounded container'>
          <div className="text-center px-3 mb-4 text-capitalize">
              <h1 className="text-warning mb-4">{data.room} Chat Room</h1>
          </div>
          <div className="bg-light border rounded p-3 mb-4" style={{ height: "450px", overflowY: "scroll" }}>
              {
                  allmsg.map((msg) => {
                      return data.name === msg.name ?            
                        <div className="row justify-content-end pl-5">
                            <div className="d-flex flex-column align-items-end m-2 shadow p-2 bg-info border rounded w-auto">
                                <div>
                                      <strong className="m-1">{msg.name}</strong>
                                      <small className="text-muted"><Moment fromNow>{ msg.time}</Moment></small>
                                </div>
                                  <h4 className='m-1'>{msg.message}</h4>
                            </div>
                        </div> :
                          
                        <div className="justify-content-start row">
                            <div className="d-flex flex-column m-2 p-2 shadow bg-white border rounded w-auto">
                                <div>
                                      <strong className="m-1">{ msg.name}</strong>
                                    <small className="text-muted m-1"><Moment fromNow>{ msg.time}</Moment></small>
                                </div>
                                  <h4 className='m-1'>{ msg.message}</h4>
                            </div>
                        </div>
                  })
              }
              <div ref={msgBoxRef}></div>
          </div>
          <div className="form-group d-flex">
              <input type="text" name="message" onKeyDown={handleEnter} onChange={(e)=>{setMessage(e.target.value)}} value={message} placeholder='Type Your Message' className="form-control bg-light" />
              <button onClick={submitHandle} className="btn btn-warning mx-2">Send</button>
          </div>
    </div>
  )
}

export default ChatRoom;
