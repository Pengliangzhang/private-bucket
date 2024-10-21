const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-white">加载中...</p>
      </div>
    </div>
  );
};

export default Loading;
