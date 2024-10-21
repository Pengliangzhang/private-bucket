interface Image {
  id: number;
  url: string;
  title: string;
}

interface ImageGridProps {
  images: Image[];
  onImageClick: (id: number) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onImageClick }) => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {images.map(image => (
        <div
          key={image.id}
          className="relative"
          onClick={() => onImageClick(image.id)}
        >
          <img src={image.url} alt={image.title} className="rounded-lg shadow" />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
