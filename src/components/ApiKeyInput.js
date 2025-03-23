import { useState, useEffect } from 'react';

export default function ApiKeyInput({ apiKey, setApiKey }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // 组件加载时从localStorage读取API密钥
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsSaved(true);
    }
  }, [setApiKey]);

  // 保存API密钥到localStorage
  const handleSaveApiKey = () => {
    if (apiKey) {
      localStorage.setItem('openai_api_key', apiKey);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  // 清除保存的API密钥
  const handleClearApiKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setIsSaved(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">OpenAI API密钥</h2>
      <div className="flex items-center space-x-2 mb-2">
        <input
          type={isVisible ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="输入您的OpenAI API密钥"
          className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          title={isVisible ? "隐藏密钥" : "显示密钥"}
        >
          {isVisible ? "隐藏" : "显示"}
        </button>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={handleSaveApiKey}
          disabled={!apiKey}
          className={`px-4 py-2 rounded ${
            apiKey ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          保存密钥
        </button>
        
        <button
          onClick={handleClearApiKey}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
        >
          清除密钥
        </button>
        
        {isSaved && (
          <span className="text-green-500 flex items-center ml-2">
            ✓ 已保存到浏览器
          </span>
        )}
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        您的API密钥将仅存储在浏览器本地，不会传输到任何服务器。
      </p>
    </div>
  );
}
