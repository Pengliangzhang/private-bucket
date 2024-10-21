interface Album {
  id: number;
  name: string;
}

interface AlbumListProps {
  albums: Album[];
  onSelectAlbum: (id: number) => void;
}

const AlbumList: React.FC<AlbumListProps> = ({ albums, onSelectAlbum }) => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {albums.map(album => (
        <div
          key={album.id}
          className="p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 cursor-pointer"
          onClick={() => onSelectAlbum(album.id)}
        >
          <h3 className="text-lg font-bold">{album.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default AlbumList;
