import { useState, useEffect } from 'react';
import AlbumList from './../../components/album/AlbumList';
import ImageGrid from './../../components/album/ImageGrid';
import ImageDetail from './../../components/album/ImageDetail';
import UploadImage from './../../components/album/UploadImage';

interface Album {
  id: number;
  name: string;
}

interface Image {
  id: number;
  url: string;
  title: string;
}

const PhotoManagementApp: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  useEffect(() => {
    // 模拟从API获取相册
    setAlbums([
      { id: 1, name: '旅行' },
      { id: 2, name: '家庭' },
      { id: 3, name: '朋友' },
    ]);
  }, []);

  const onSelectAlbum = (albumId: number) => {
    // 模拟从API获取选定相册中的图片
    setSelectedAlbum(albumId);
    setImages([
      { id: 1, url: 'https://via.placeholder.com/150', title: '图片1' },
      { id: 2, url: 'https://via.placeholder.com/150', title: '图片2' },
    ]);
  };

  const onImageClick = (imageId: number) => {
    const image = images.find(img => img.id === imageId);
    setSelectedImage(image || null);
  };

  const closeImageDetail = () => {
    setSelectedImage(null);
  };

  const handleUpload = (newImages: File[]) => {
    const uploadedImages = newImages.map((file, index) => ({
      id: images.length + index + 1,
      url: URL.createObjectURL(file),
      title: file.name,
    }));
    setImages([...images, ...uploadedImages]);
  };

  return (
    <div className="container mx-auto p-4 pt-4 mt-16">
      {!selectedAlbum && <AlbumList albums={albums} onSelectAlbum={onSelectAlbum} />}
      {selectedAlbum && (
        <>
          <UploadImage onUpload={handleUpload} onSelectAlbum={onSelectAlbum} />
          <ImageGrid images={images} onImageClick={onImageClick} />
        </>
      )}
      {selectedImage && <ImageDetail image={selectedImage} onClose={closeImageDetail} />}
    </div>
  );
};

export default PhotoManagementApp;