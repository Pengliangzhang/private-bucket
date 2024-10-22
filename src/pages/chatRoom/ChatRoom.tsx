import { useState, useRef, useEffect } from 'react';
import axiosInstance from '../../axiosInstance'
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string; // 更改为 string
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
  sender: string;
  senderId: string;
  msgType: string;
}

const MAX_RETRIES = 5;  // 最大重试次数
let retries = 0;

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('User');

  const fileInputRef = useRef<HTMLInputElement>(null); // 引用 input 元素
  const messagesEndRef = useRef<HTMLDivElement>(null); // 引用消息列表底部
  const socketRef = useRef<WebSocket | null>(null); // 保存 WebSocket 实例
  const reconnectIntervalRef = useRef<NodeJS.Timeout | null>(null); // 保存定时器
  const isWebSocketInitialized = useRef(false); // 用来防止重复创建 WebSocket

  // 创建 WebSocket 连接
  const createWebSocket = () => {
    if (isWebSocketInitialized.current) return;  // 确保只创建一次
    console.log('Creating WebSocket connection...');

    socketRef.current = new WebSocket('ws://192.168.68.117:8080/chatbox/v1/chat');
    isWebSocketInitialized.current = true;

    // 当 WebSocket 打开时
    socketRef.current.onopen = () => {
      if (reconnectIntervalRef.current) {
        clearInterval(reconnectIntervalRef.current); // 停止重连
      }
      retries = 0;  // 重置重连次数
      console.log('WebSocket connected');
    };

    // 当接收到消息时
    socketRef.current.onmessage = (event) => {
      const receivedMessage: Message = JSON.parse(event.data);
      if (receivedMessage.msgType === "SYSTEM") {
        return;
      }
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    };

    // WebSocket 断开时，触发重连
    socketRef.current.onclose = () => {
      console.log('WebSocket closed, attempting to reconnect...');
      if (retries < MAX_RETRIES) {
        retries += 1;
        reconnectIntervalRef.current = setInterval(() => {
          console.log(`Reconnecting... attempt ${retries}`);
          createWebSocket();  // 尝试重新连接
        }, 5000);  // 每 5 秒重连一次
      } else {
        console.log('Max retries reached. Could not reconnect.');
      }
    };

    // 错误处理
    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  const fetchBlobData = async (fileId: string) => {
    // const response = await fetch(`http://localhost:8080/api/file/${fileName}`);
    const response = await axiosInstance.get(`/photos/download/${fileId}`, {
      responseType: 'blob', // 设置响应类型为 blob
    });
    const blob = await response.data;
    return URL.createObjectURL(blob);  // 创建一个对象 URL
  };

  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get('/message/getAllMsg');
      const sortedFiles = response.data.data.sort((a: Message, b: Message) => {
        return new Date(a['createDatetime']).getTime() - new Date(b['createDatetime']).getTime();
      });
      // const data = response.data.data;
      setMessages(sortedFiles);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // 初始化 WebSocket 连接
  useEffect(() => {
    createWebSocket();
    setUsername(localStorage.getItem('username'))
    fetchMessages()

    // 清理工作：在组件卸载时关闭 WebSocket 并清除定时器
    return () => {
      if (socketRef.current) {
        if (socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.close();  // 只在连接打开时关闭 WebSocket
        }
      }
      if (reconnectIntervalRef.current) {
        clearInterval(reconnectIntervalRef.current);  // 清除重连定时器
      }
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string); // 预览图片的 Base64 编码
      };
      reader.readAsDataURL(file);
    }

    // 在选择文件后，强制重置 input 的值，以便允许再次选择相同文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendMessage = () => {
    if (!message.trim() && !image) return;

    const newMessage: Message = {
      id: uuidv4(),  // 使用 UUID 生成唯一 id
      text: message,
      imageUrl: image,
      videoUrl: "",
      sender: username,
      senderId: localStorage.getItem('userId'),
      msgType: "msg",
    };

    // 通过 WebSocket 发送消息
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(newMessage));
    }

    setMessages([...messages, newMessage]);
    setMessage('');
    setImage(null); // 发送后清空图片预览
  };

  const deleteImage = () => {
    setImage(null); // 清除预览的图片
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // 清空 input 的值以确保可以再次选择同一张图片
    }
  };

  // 每当 messages 更新后，自动滚动到底部
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
            className={`p-2 rounded-md max-w-xs ${
              msg.sender === username
                ? 'bg-blue-500 text-white self-end'
                : 'bg-gray-300 text-black self-start'
            }`}
          >
            <div className="text-xs font-bold">{msg.sender}</div>
            {msg.text && <div>{msg.text}</div>}
            {/* 图片展示 */}
            {msg.imageUrl && (
               <img
                 src={msg.imageUrl} // 先设置默认的路径
                 alt="Uploaded"
                 className="max-w-full mt-2 rounded"
                 onLoad={async (event) => {
                   const imgUrl = await fetchBlobData(msg.imageUrl);
                   (event.target as HTMLImageElement).src = imgUrl;  // 更新为 Blob URL
                 }}
               />
            )}

            {/* 视频展示 */}
            {msg.videoUrl && (
              <video
                controls
                className="max-w-full mt-2 rounded"
                onLoadStart={async (event) => {
                  const videoUrl = await fetchBlobData(msg.videoUrl);
                  (event.target as HTMLVideoElement).src = videoUrl;  // 更新为 Blob URL
                }}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ))}
        {/* 用于自动滚动到底部的占位元素 */}
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

        {/* 图片上传按钮 */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="imageUpload"
          ref={fileInputRef} // 绑定 input 的 ref
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
