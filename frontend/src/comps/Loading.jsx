const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#463f3a]">
      <div className="relative">
        {/* Spinning circle */}
        <div className="w-16 h-16 border-4 border-[#544c46] border-t-[#f4f3ee] rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-[#d6d2c0] text-lg">{message}</p>
    </div>
  );
};

export default Loading;
