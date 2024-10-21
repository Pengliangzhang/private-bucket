import { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import Loading from '../../components/loading/Loading'; // 引入 Loading 组件

// 文件信息接口
interface FileItem {
  fileName: string;
  fileId: string;
  updatedAt: string; // 文件更新时间
}

const FileList: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]); // 保存文件列表
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null); // 当前选中的文件
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null); // PDF 文件预览 URL
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false); // 控制弹窗的状态
  const [loading, setLoading] = useState<boolean>(false); // 加载状态
  const [, setError] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  // 获取文件列表并按更新时间排序
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axiosInstance.get('/photos/retrieveCurr');
        const sortedFiles = response.data.data.sort((a: FileItem, b: FileItem) => {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
        setFiles(sortedFiles);
      } catch (error) {
        console.error('获取文件列表失败:', error);
      }
    };
    fetchFiles();
  }, []);

  // 获取 PDF 文件并创建 Blob URL
  const fetchFilePreview = async (file: FileItem) => {
    setLoading(true);  // 设置加载中状态
    setError(null);  // 清除上次的错误信息
    try {
      const response = await axiosInstance.get(`/photos/download/${file.fileId}`, {
      // const response = await axiosInstance.get(`/photos/download/6716a1fe6bc255264a899b21`, {
        responseType: 'blob', // 设置响应类型为 blob
      });

      // 将 Blob 转换为可供 iframe 预览的 URL
      const url = URL.createObjectURL(response.data);
      setFileType(response.data.type); // 获取 Blob 的 MIME 类型
      setFilePreviewUrl(url);
      setSelectedFile(file);
      setIsPopupOpen(true); // 打开弹窗
    } catch (error) {
      setError('获取文件预览失败');
      console.error('预览文件失败:', error);
    } finally {
      setLoading(false);  // 完成加载
    }
  };
  const isImage = fileType?.startsWith("image/");
  const isVideo = fileType?.startsWith("video/");
  const isIframeContent = fileType === "application/pdf" || fileType === "text/html";

  return (
    <div className="container mx-auto p-4 mt-16">
      {loading && <Loading />}
      <h1 className="text-3xl font-bold mb-8">文件列表</h1>

      {/* 文件列表按更新时间排序并以一行一行显示 */}
      <ul className="space-y-4">
        {files.map((file) => (
          <li key={file.fileId} className="flex justify-between items-center bg-white shadow p-4 rounded">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold break-words whitespace-normal max-w-full">{file.fileName}</h2>
              <p className="text-gray-500 text-sm">更新时间: {new Date(file.updatedAt).toLocaleString()}</p>
            </div>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 ml-4 flex-shrink-0"
              onClick={() => fetchFilePreview(file)}
            >
              预览
            </button>
          </li>
        ))}
      </ul>



      {/* 弹窗，用于预览和更新 PDF 文件 */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsPopupOpen(false)}
            >
              关闭
            </button>
            <h2 className="text-xl font-bold mb-4">
              {selectedFile ? `预览文件: ${selectedFile.fileName}` : '加载中...'}
            </h2>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p>加载中...</p> {/* 显示加载中的信息 */}
              </div>
            ) : (
              filePreviewUrl && (
                <div className="width: '100%', height: '100%' mb-4">
                  {/* <iframe
                    src={filePreviewUrl}
                    className="w-full h-64"
                    title="资源预览"
                    
                  ></iframe> */}
                  {isImage ? (
                    <img
                      src={filePreviewUrl!}
                      alt="图片预览"
                      className="w-full h-auto max-h-64 object-contain"
                      onContextMenu={(e) => e.preventDefault()} // 禁用右键菜单
                    />
                  ) : isVideo ? (
                    <video
                      src={filePreviewUrl!}
                      className="w-full h-64"
                      controls
                      controlsList="nodownload" // 禁用下载选项
                      onContextMenu={(e) => e.preventDefault()} // 禁用右键菜单
                    >
                      您的浏览器不支持视频播放。
                    </video>
                  ) : isIframeContent ? (
                    <iframe
                      src={filePreviewUrl!}
                      className="w-full h-64"
                      title="资源预览"
                    ></iframe>
                  ) : (
                    <p>不支持的文件类型</p>
                  )}
                </div>

              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileList;
