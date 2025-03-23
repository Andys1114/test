export default function ResultDisplay({ transcript, summary, isLoading, progress }) {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">处理中...</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-gray-500">
          {progress < 50 ? '音频转录中...' : '内容总结中...'}
        </p>
      </div>
    );
  }

  if (!transcript && !summary) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      {summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">内容总结</h2>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 whitespace-pre-wrap">
            {summary}
          </div>
          <div className="mt-2 flex justify-end">
            <button
              onClick={() => navigator.clipboard.writeText(summary)}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              复制总结
            </button>
          </div>
        </div>
      )}
      
      {transcript && (
        <div>
          <h2 className="text-xl font-bold mb-4">完整转录</h2>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-96 overflow-y-auto whitespace-pre-wrap">
            {transcript}
          </div>
          <div className="mt-2 flex justify-end">
            <button
              onClick={() => navigator.clipboard.writeText(transcript)}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              复制转录
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
