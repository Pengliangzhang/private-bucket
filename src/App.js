import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import PrivateRoute from "./RouteAuth"
import Home from './pages/home/Home';
import Login from './pages/login/Login'
import UploadFile from './pages/upload/Upload'
import Header from './components/header/Header'
import FileList from './pages/fileList/FileList'
import NotFound from './pages/notFound/NotFound'; // 引入 404 页面

function App() {
  return (
    <Router>
      <Header />  {/* 放置导航栏 */}
      <Routes>
        <Route path="/login" element={<Login />} />  {/* 路由配置 */}

        {/* 受保护的页面 */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <UploadFile />
            </PrivateRoute>
          }
        />
        <Route
          path="/fileList"
          element={
            <PrivateRoute>
              <FileList />
            </PrivateRoute>
          }
        />
        {/* 404 路由：当路径不匹配时显示 NotFound 组件 */}
        <Route path="*" element={
          <PrivateRoute>
            <NotFound />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
