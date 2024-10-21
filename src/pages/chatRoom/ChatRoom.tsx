import { useState, useEffect } from 'react';

const ChatRoom = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  let ws = null;
  useEffect(() => {
    // 建立 WebSocket 连接
    
    if (ws === null) {
      ws = new WebSocket('ws://localhost:8086/v1/chat');
    }

    ws.onopen = () => {
      console.log('WebSocket connection established');
      // 向服务器发送一条消息
      socket.send('Hello from Client');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error: ', error);
    };

    ws.onclose = (event) => {
      console.log('WebSocket connection closed: ', event);
    };

    
    ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
        if (event.wasClean) {
            console.log('Connection closed cleanly');
        } else {
            console.error('Connection closed with error', event);
        }
    };
    
    ws.onerror = (error) => {
        console.error('WebSocket error: ', error);
    };

  
    setSocket(ws);

    // 监听消息
    ws.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && message) {
      socket.send(message);
      setMessage('');
    }
  };

  return (
    <div className="container mx-auto p-4 mt-16">
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatRoom;
