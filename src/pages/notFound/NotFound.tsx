import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg mb-4">页面未找到</p>
      <Link to="/home" className="text-blue-500 underline">
        返回首页
      </Link>
    </div>
  );
};

export default NotFound;
