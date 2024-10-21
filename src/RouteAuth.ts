// 获取 token 的函数
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  // 简单检查 token 是否存在，通常还会调用后端进行 token 验证
  return token !== null;
};

const PrivateRoute = ({ children }) => {
  // 如果用户没有 token，重定向到 /login
  if (!isAuthenticated()) {
    return window.location.href = '/login';
  }

  // 如果验证通过，渲染对应的子组件
  return children;
};

export default PrivateRoute;
