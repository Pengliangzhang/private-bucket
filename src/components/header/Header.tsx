import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  // State to manage menu visibility
  const [showMenu, setShowMenu] = useState(false);

  // 检查用户是否已登录
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token; // 返回 true/false 判断 token 是否存在
  };

  const handleLogout = () => {
    // 用户登出，清除 token，并导航到登录页面
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 p-4 text-white fixed top-0 left-0 w-full z-50">
      <nav className="flex justify-between items-center">
        <div className="text-lg font-bold">
          <Link to="/home">DYB Personal Album</Link>
        </div>
        <button className="sm:hidden block text-white" onClick={() => setShowMenu(!showMenu)}>
          {/* This button toggles the hamburger menu */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
        <ul className={`sm:flex space-x-4 ${showMenu ? 'flex flex-col items-end' : 'hidden'} sm:block`}>
          {isAuthenticated() ? (
            <>
              {showMenu && (
                <li>
                  <Link to="/home" className={`hover:text-gray-300 visibility: ${showMenu ? 'visible' : 'hidden'}`}>
                    主页
                  </Link>
                </li>
              )}
              <li>
                <Link to="/fileList" className="hover:text-gray-300">
                  资源列表
                </Link>
              </li>
              <li>
                <Link to="/upload" className="hover:text-gray-300">
                  上传照片
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="hover:text-gray-300">
                  登出
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="hover:text-gray-300">
                登录
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>

  );
};

export default Header;