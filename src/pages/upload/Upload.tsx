import axiosInstance from '../../axiosInstance';
import { useState } from 'react';

const UploadFile: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // 保存选中的文件
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);  // 上传是否成功
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 处理文件选择
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // 处理上传逻辑
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setUploadSuccess(false);

    if (!selectedFile) {
      setError('请选择一个文件');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    try {
      await axiosInstance.post(`/photos/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadSuccess(true); // 上传成功
    } catch (error) {
      setError('文件上传失败，请重试。');
    } finally {
      setLoading(false);
    }
  };

  // 重新上传文件
  const handleReset = () => {
    setSelectedFile(null);  // 重置文件
    setUploadSuccess(false);  // 重置上传成功状态
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 mt-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {!uploadSuccess ? (
          <>
            <h2 className="text-2xl font-bold text-center">上传文件</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">选择照片:</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* 错误提示 */}
              {error && <p className="text-red-500 text-center">{error}</p>}

              {/* 上传按钮 */}
              <button
                type="submit"
                className="w-full p-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? '上传中...' : '上传'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center">上传成功</h2>
            <p className="text-center text-green-500">文件已成功上传。</p>
            <p className="text-center">点击下面的按钮重新上传文件。</p>
            <button
              onClick={handleReset}
              className="w-full p-3 mt-4 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500"
            >
              重新上传
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadFile;
