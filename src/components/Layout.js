export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">音频转录与总结工具</h1>
        </div>
      </header>
      <main>
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            本工具在您的浏览器中运行，音频不会上传到我们的服务器。API密钥仅保存在您的设备上。
          </p>
        </div>
      </footer>
    </div>
  );
}
