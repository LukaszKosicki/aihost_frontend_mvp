type PropsType = {
  isLoading: boolean
}

const LoadingOverlay = ({ isLoading }: PropsType) => {
  if (!isLoading) return null;

  return (
     <div
     style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} 
     className="fixed inset-0 flex items-center justify-center bg-gray-200 z-[100000] pointer-events-auto">
      <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingOverlay;