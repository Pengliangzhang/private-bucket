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
  const [imageUrl, setImageUrl] = useState<string | null>(null);  // 保存上传后的 imageUrl
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);  // 直接渲染上传的图片
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('User');
  const [userId, setUserId] = useState<string>('');
  const [imageCache, setImageCache] = useState<{ [key: string]: string }>({});  // 用来缓存从服务器获取到的图片

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

  // 处理文件上传，上传后保存文件 ID 到 imageUrl 或 videoUrl，并直接预览上传的图片
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);  // 将文件添加到 formData 中

      // 创建本地预览 URL，用于即时显示
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);  // 直接预览图片

      try {
        const response = await axiosInstance.post('/photos/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const fileId = response.data.data;  // 假设服务器返回的 ID 是 fileId

        if (file.type.startsWith('image/')) {
          setImageUrl(fileId);  // 如果是图片，保存到 imageUrl
        } else if (file.type.startsWith('video/')) {
          setVideoUrl(fileId);  // 如果是视频，保存到 videoUrl
        }
      } catch (error) {
        console.error('File upload error:', error);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendMessage = () => {
    if (!message.trim() && !imageUrl && !videoUrl) return;

    const newMessage: Message = {
      id: uuidv4(),
      text: message,
      imageUrl: imageUrl || null,
      videoUrl: videoUrl || null,
      sender: username,
      senderId: userId,
      msgType: "msg",
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(newMessage));
    }

    setMessages([...messages, newMessage]);
    setMessage('');
    setImageUrl(null);
    setVideoUrl(null);
    setImagePreviewUrl(null);  // 清除预览
  };

  const deleteImage = () => {
    setImagePreviewUrl(null);  // 删除本地预览
    setImageUrl(null);  // 清空 imageUrl
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 当聊天记录中有图片时，通过 useEffect 获取图片 Blob 数据并缓存
  useEffect(() => {
    messages.forEach(async (msg) => {
      if (msg.imageUrl && !imageCache[msg.imageUrl]) {  // 如果图片未缓存，则从服务器获取
        const imageUrl = await fetchBlobData(msg.imageUrl);
        setImageCache((prevCache) => ({ ...prevCache, [msg.imageUrl]: imageUrl }));
      }
    });
  }, [messages]);

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
            className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`p-2 rounded-md max-w-[70%] ${
              msg.senderId === userId
                ? 'bg-blue-500 text-white self-end'
                : 'bg-white text-black self-start'
            }`}>
              <div className="text-xs font-bold">{msg.sender}</div>
              {msg.text && <div>{msg.text}</div>}
              
              {/* 如果是从聊天记录中获取到的图片，需要从服务器获取 */}
              {msg.imageUrl && (
                <img
                  src={imagePreviewUrl || imageCache[msg.imageUrl]}  // 使用本地预览或缓存的图片
                  alt="Uploaded"
                  className="max-w-full mt-2 rounded"
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
      {imagePreviewUrl && (
        <div className="p-4 bg-white flex items-center justify-between sm:max-w-sm mx-auto">
          <img src={imagePreviewUrl} alt="Preview" className="max-w-xs max-h-32 object-cover rounded-md" />
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
          accept="image/*,video/*"
          onChange={handleFileUpload}
          className="hidden"
          id="fileUpload"
          ref={fileInputRef}
        />
        <label htmlFor="fileUpload" className="cursor-pointer bg-gray-200 p-2 rounded-md">
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
