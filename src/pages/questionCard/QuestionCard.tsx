import { useState, useEffect } from 'react';

// 定义问题和答案的类型
interface Question {
  q: string;
  a: string;
}

// 示例问题数组
const questions: Question[] = [
  { q: '问题 1：太阳是怎样升起的？', a: '答案：太阳通过地球自转的方向从东升起。' },
  { q: '问题 2：水的化学式是什么？', a: '答案：水的化学式是H₂O。' },
  { q: '问题 3：地球有几大洲？', a: '答案：地球有七大洲。' },
  // 你可以添加更多的问题
];

const QuestionCard: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0); // 当前问题索引
  const [showAnswer, setShowAnswer] = useState<boolean>(false); // 是否显示答案

  // 加载随机问题
  const loadRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentQuestionIndex(randomIndex);
    setShowAnswer(false); // 每次加载新问题时隐藏答案
  };

  // 键盘事件处理器
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'Space') {
      setShowAnswer((prev) => !prev); // 按空格键显示或隐藏答案
    } else if (event.code === 'ArrowUp') {
      // 上一个问题
      setCurrentQuestionIndex((prevIndex) => (prevIndex - 1 + questions.length) % questions.length);
      setShowAnswer(false); // 切换问题时隐藏答案
    } else if (event.code === 'ArrowDown') {
      // 下一个问题
      setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
      setShowAnswer(false); // 切换问题时隐藏答案
    }
  };

  // 组件挂载时监听键盘事件
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // 只在组件挂载时添加和移除事件监听

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] bg-gray-100 p-4 mt-16">
      <h1 className="text-3xl font-bold mb-8">请回答</h1>
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <div className="text-xl font-semibold mb-4 text-gray-800">
          {questions[currentQuestionIndex].q}
        </div>
        <div className={`text-lg text-gray-700 ${showAnswer ? 'block' : 'hidden'}`}>
          {questions[currentQuestionIndex].a}
        </div>
      </div>
      <button
        onClick={loadRandomQuestion}
        className="mt-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
      >
        随机选择一个问题
      </button>
    </div>
  );
};

export default QuestionCard;
