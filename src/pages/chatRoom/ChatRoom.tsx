import { useState, useRef, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
  sender: string;
  senderId: string;
  msgType: string;
}

const MAX_RETRIES = 5;
let retries = 0;

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('User');
  const [userId, setUserId] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isWebSocketInitialized = useRef(false);

  const createWebSocket = () => {
    if (isWebSocketInitialized.current) return;
    console.log('Creating WebSocket connection...');

    socketRef.current = new WebSocket('ws://192.168.68.117:8080/chatbox/v1/chat');
    isWebSocketInitialized.current = true;

    socketRef.current.onopen = () => {
      if (reconnectIntervalRef.current) {
        clearInterval(reconnectIntervalRef.current);
      }
      retries = 0;
      console.log('WebSocket connected');
    };

    socketRef.current.onmessage = (event) => {
      const receivedMessage: Message = JSON.parse(event.data);
      if (receivedMessage.msgType === "SYSTEM") {
        return;
      }
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket closed, attempting to reconnect...');
      if (retries < MAX_RETRIES) {
        retries += 1;
        reconnectIntervalRef.current = setInterval(() => {
          console.log(`Reconnecting... attempt ${retries}`);
          createWebSocket();
        }, 5000);
      } else {
        console.log('Max retries reached. Could not reconnect.');
      }
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  const fetchBlobData = async (fileId: string) => {
    const response = await axiosInstance.get(`/photos/download/${fileId}`, {
      responseType: 'blob',
    });
    const blob = await response.data;
    return URL.createObjectURL(blob);
  };

  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get('/message/getAllMsg');
      const sortedFiles = response.data.data.sort((a: Message, b: Message) => {
        return new Date(a['createDatetime']).getTime() - new Date(b['createDatetime']).getTime();
      });
      setMessages(sortedFiles);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    createWebSocket();
    setUsername(localStorage.getItem('username') || 'User');
    setUserId(localStorage.getItem('userId') || '');
    fetchMessages();

    return () => {
      if (socketRef.current) {
        if (socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.close();
        }
      }
      if (reconnectIntervalRef.current) {
        clearInterval(reconnectIntervalRef.current);
      }
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendMessage = () => {
    if (!message.trim() && !image) return;

    const newMessage: Message = {
      id: uuidv4(),
      text: message,
      imageUrl: image,
      videoUrl: "",
      sender: username,
      senderId: userId,  // 确保使用 userId，而不是 username
      msgType: "msg",
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(newMessage));
    }

    setMessages([...messages, newMessage]);
    setMessage('');
    setImage(null);
  };

  const deleteImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4 text-center text-lg font-semibold">
        Chatroom
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}  // 确保父容器有 flex 布局
          >
            <div className={`p-2 rounded-md max-w-[70%] ${
              msg.senderId === userId
                ? 'bg-blue-500 text-white self-end'  // 自己的消息靠右，背景为蓝色
                : 'bg-white text-black self-start'  // 别人的消息靠左，背景为白色
            }`}>
              <div className="text-xs font-bold">{msg.sender}</div>
              {msg.text && <div>{msg.text}</div>}
              
              {msg.imageUrl && (
                <img
                  src={msg.imageUrl}
                  alt="Uploaded"
                  className="max-w-full mt-2 rounded"
                  onLoad={async (event) => {
                    const imgUrl = await fetchBlobData(msg.imageUrl);
                    (event.target as HTMLImageElement).src = imgUrl;
                  }}
                />
              )}

              {msg.videoUrl && (
                <video
                  controls
                  className="max-w-full mt-2 rounded"
                  onLoadStart={async (event) => {
                    const videoUrl = await fetchBlobData(msg.videoUrl);
                    (event.target as HTMLVideoElement).src = videoUrl;
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Image Preview with Delete Option */}
      {image && (
        <div className="p-4 bg-white flex items-center justify-between sm:max-w-sm mx-auto">
          <img src={image} alt="Preview" className="max-w-xs max-h-32 object-cover rounded-md" />
          <button
            onClick={deleteImage}
            className="bg-red-500 text-white p-1 ml-4 rounded-md hover:bg-red-600"
          >
            删除
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white flex space-x-2 border-t border-gray-300">
        <input
          type="text"
          className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="imageUpload"
          ref={fileInputRef}
        />
        <label htmlFor="imageUpload" className="cursor-pointer bg-gray-200 p-2 rounded-md">
          📷
        </label>

        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
