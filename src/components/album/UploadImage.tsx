import { useState } from 'react';

interface UploadImageProps {
  onUpload: (newImages: File[]) => void;
  onSelectAlbum: (albumId: number) => void;
}

const UploadImage: React.FC<UploadImageProps> = ({ onUpload, onSelectAlbum }) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles || !selectedAlbum) return;

    setUploading(true);
    const filesArray = Array.from(selectedFiles);

    // 模拟上传操作
    try {
      console.log('Uploading:', filesArray);
      onUpload(filesArray);
    } catch (error) {
      console.error('Error uploading files:', error);
    }

    setUploading(false);
    setSelectedFiles(null);
  };

  const handleAlbumSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAlbum(Number(event.target.value));
    onSelectAlbum(Number(event.target.value));
  };

  return (
    <div className="p-4 border-dashed border-2 border-gray-300 rounded-lg">
      <div className="mb-2">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          选择相册:
        </label>
        <select
          value={selectedAlbum || ''}
          onChange={handleAlbumSelect}
          className="border rounded w-full py-2 px-3 text-gray-700"
        >
          <option value="" disabled>请选择相册</option>
          <option value="1">旅行</option>
          <option value="2">家庭</option>
          <option value="3">朋友</option>
        </select>
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        // capture="environment" // 允许拍照和选择相册
        onChange={handleFileChange}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white p-2 rounded"
        disabled={uploading || !selectedFiles || !selectedAlbum}
      >
        {uploading ? '上传中...' : '上传图片'}
      </button>
    </div>
  );
};

export default UploadImage;
