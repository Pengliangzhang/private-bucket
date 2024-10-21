import { useEffect } from 'react';
const Home: React.FC = () => {
  useEffect(() => {
    const header = document.querySelector('header');
    const content = document.querySelector('.content-container');

    if (header && content) {
      const headerHeight = (header as HTMLElement).offsetHeight;
      (content as HTMLElement).style.marginTop = `${headerHeight}px`;
    }
  }, []);
  return (
    <div className="container mx-auto p-6 content-container">
      {/* 页面标题 */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-gray-800">欢迎使用贝思达报告管理系统</h1>
        <p className="text-center text-lg text-gray-600 mt-2">
          在这里，您可以方便地管理和预览您的 PDF 文件
        </p>
      </header>

      {/* 系统简介部分 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">系统简介</h2>
        <p className="text-gray-700">
          这个系统是为用户提供文件管理、预览、更新等功能的。通过该系统，您可以上传新的文件、预览现有文件并进行更新。以下是系统的核心功能和使用步骤。
        </p>
      </section>

      {/* 系统功能概览 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">系统功能概览</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>文件上传：支持上传新的 PDF 文件，方便管理和查看。</li>
          <li>文件预览：可以通过系统直接预览 PDF 文件，无需下载。</li>
          <li>文件更新：支持文件更新，您可以上传新版文件替换现有文件。</li>
          <li>文件管理：展示文件列表，快速查看所有文件及其状态。</li>
        </ul>
      </section>

      {/* 如何使用系统 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">如何使用该系统？</h2>
        <ol className="list-decimal pl-6 text-gray-700">
          <li>登录系统：首先，您需要使用账户登录系统。</li>
          <li>查看文件列表：在报告列表中，您可以看到已上传的文件。</li>
          <li>上传新文件：点击"上传文件"按钮，选择新的 PDF 文件进行上传。</li>
          <li>预览文件：点击文件列表中的"预览"按钮，您可以在弹窗中预览文件内容。</li>
          <li>更新文件：如果需要更新文件，可以点击"更新"按钮选择新的文件并上传。</li>
        </ol>
      </section>

      {/* 常见问题 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">常见问题</h2>
        <div className="text-gray-700">
          <h3 className="text-xl font-semibold">1. 我上传的文件支持哪些格式？</h3>
          <p className="mb-4">目前系统支持 PDF 文件的上传与预览。</p>

          <h3 className="text-xl font-semibold">2. 如何更新已上传的文件？</h3>
          <p className="mb-4">您可以在文件列表中点击"更新"，选择新版本的文件并上传替换旧文件。</p>

          <h3 className="text-xl font-semibold">3. 文件的大小有限制吗？</h3>
          <p className="mb-4">系统支持的最大文件大小是 10MB，上传文件时请确保文件大小在这个限制内。</p>
        </div>
      </section>

      {/* 相关资源 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">相关资源</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>
            <a href="/home" className="text-blue-500 hover:underline">系统文档</a> - 查看详细的系统使用文档。
          </li>
          <li>
            <a href="/home" className="text-blue-500 hover:underline">帮助中心</a> - 如果遇到问题，可以访问帮助中心。
          </li>
        </ul>
      </section>

      {/* 底部版权信息 */}
      <footer className="text-center text-gray-600 mt-8">
        © 2024 贝思达报告管理系统
      </footer>
    </div>
  );
};

export default Home;
