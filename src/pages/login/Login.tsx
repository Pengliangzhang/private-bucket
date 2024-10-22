import axiosInstance from './../../axiosInstance';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  // 定义状态
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

   // 检查是否已登录
   useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  // 表单提交处理
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!email || !password) {
        setError('请输入用户名和密码.');
        return;
      }
      const response = await axiosInstance.post('/authenticate/auth', {
        email,
        password,
      });
      
      if (response.data.message === "Success") {
        localStorage.setItem('token', response.data?.data?.token);
        localStorage.setItem('role', response.data?.data?.role);
        localStorage.setItem('username', response.data?.data?.username);
        localStorage.setItem('userId', response.data?.data?.id);
        return navigate('/home');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Failed to login. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">登录</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 邮箱输入框 */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          {/* 密码输入框 */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
            />
          </div>

          {/* 错误提示 */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* 登录按钮 */}
          <button
            type="submit"
            className="w-full p-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
