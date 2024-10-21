import axios from 'axios';

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/v1',  // 替换为你的后端 API 地址
  timeout: 10000,  // 设置请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 拦截请求，添加通用的 Token 或其他配置
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    // 检查请求 URL 是否是 /authenticate/auth
    if (config.url === '/authenticate/auth') {
      return config;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      window.location.href = '/login';  // 重定向到登录页面
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 拦截响应，处理错误
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 处理错误响应
    if (error.response && error.response.status === 401) {
      // 可以处理未授权访问的逻辑，例如跳转到登录页
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
