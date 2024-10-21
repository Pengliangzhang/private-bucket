interface ImageDetailProps {
  image: { id: number; url: string; title: string };
  onClose: () => void;
}

const ImageDetail: React.FC<ImageDetailProps> = ({ image, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative p-4 bg-white rounded-lg shadow">
        <button className="absolute top-2 right-2 text-red-500" onClick={onClose}>关闭</button>
        <img src={image.url} alt={image.title} className="max-w-full max-h-screen" />
        <p className="text-center mt-2">{image.title}</p>
      </div>
    </div>
  );
};

export default ImageDetail;
