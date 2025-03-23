import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import ApiKeyInput from '../components/ApiKeyInput';
import AudioUploader from '../components/AudioUploader';
import ResultDisplay from '../components/ResultDisplay';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <Layout>
      <Head>
        <title>音频转录与总结工具</title>
        <meta name="description" content="使用AI转录和总结音频内容" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="space-y-6">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <p className="text-blue-700">
            使用此工具可以转录音频内容并获取AI生成的内容总结。您需要提供自己的OpenAI API密钥。
          </p>
        </div>

        <ApiKeyInput 
          apiKey={apiKey} 
          setApiKey={setApiKey} 
        />
        
        <AudioUploader 
          apiKey={apiKey}
          setTranscript={setTranscript}
          setSummary={setSummary}
          setIsLoading={setIsLoading}
          setProgress={setProgress}
        />
        
        <ResultDisplay 
          transcript={transcript}
          summary={summary}
          isLoading={isLoading}
          progress={progress}
        />
      </div>
    </Layout>
  );
}
