import { useState, useRef } from 'react';

export default function AudioUploader({ apiKey, setTranscript, setSummary, setIsLoading }) {
  const [audioFile, setAudioFile] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        setError('文件大小不能超过25MB');
        setAudioFile(null);
        return;
      }
      
      if (!file.type.startsWith('audio/')) {
        setError('请上传音频文件');
        setAudioFile(null);
        return;
      }
      
      setError('');
      setAudioFile(file);
    }
  };

  const resetForm = () => {
    setAudioFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processAudio = async () => {
    if (!audioFile) {
      setError('请选择音频文件');
      return;
    }

    if (!apiKey) {
      setError('请输入OpenAI API密钥');
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      setProgress(10);
      
      // Step 1: 转录音频
      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('model', 'whisper-1');
      
      const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        body: formData
      });
      
      if (!transcriptionResponse.ok) {
        const errorData = await transcriptionResponse.json();
        throw new Error(`转录失败: ${errorData.error?.message || transcriptionResponse.statusText}`);
      }
      
      setProgress(50);
      const transcriptionData = await transcriptionResponse.json();
      const transcript = transcriptionData.text;
      setTranscript(transcript);
      
      // Step 2: 使用ChatGPT总结内容
      const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {role: "system", content: "请将以下音频转录内容进行总结，提取关键点和主要内容。使用中文回复。"},
            {role: "user", content: transcript}
          ],
          max_tokens: 500
        })
      });
      
      if (!summaryResponse.ok) {
        const errorData = await summaryResponse.json();
        throw new Error(`总结失败: ${errorData.error?.message || summaryResponse.statusText}`);
      }
      
      setProgress(90);
      const summaryData = await summaryResponse.json();
      const summary = summaryData.choices[0].message.content;
      setSummary(summary);
      
      setProgress(100);
      resetForm();
      
    } catch (error) {
      console.error('处理失败:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">上传音频</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          选择音频文件 (MP3, WAV, M4A 等格式, 最大 25MB)
        </label>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      
      {audioFile && (
        <div className="mb-4 p-3 bg-blue-50 rounded flex justify-between items-center">
          <span className="text-sm">
            已选择: <strong>{audioFile.name}</strong> ({(audioFile.size / (1024 * 1024)).toFixed(2)} MB)
          </span>
          <button 
            onClick={resetForm}
            className="text-red-500 hover:text-red-700"
          >
            移除
          </button>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 rounded">
          {error}
        </div>
      )}
      
      <button
        onClick={processAudio}
        disabled={!audioFile || !apiKey}
        className={`w-full py-2 px-4 rounded font-medium ${
          audioFile && apiKey
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        处理音频
      </button>
    </div>
  );
}
