import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  text?: string;
  imageUrl?: string;
  sender: string;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('User');
  const fileInputRef = useRef<HTMLInputElement>(null); // 引用 input 元素
  const messagesEndRef = useRef<HTMLDivElement>(null); // 引用消息列表底部

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
      id: messages.length + 1,
      text: message,
      imageUrl: image,
      sender: username,
    };

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
            {msg.imageUrl && (
              <img src={msg.imageUrl} alt="Uploaded" className="max-w-full mt-2 rounded" />
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
