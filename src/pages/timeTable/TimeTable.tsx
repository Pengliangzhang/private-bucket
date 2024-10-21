import { useState, useEffect } from 'react';

// 示例课程表数据
const sampleTimetable = [
  {
    day: 'Monday',
    periods: [
      { time: '08:00-09:00', subject: 'Mathematics', teacher: 'Mr. Smith' },
      { time: '09:00-10:00', subject: 'Physics', teacher: 'Ms. Johnson' }
    ]
  },
  {
    day: 'Tuesday',
    periods: [
      { time: '08:00-09:00', subject: 'English', teacher: 'Mrs. Brown' }
    ]
  }
];

const Timetable = ({ role = 'teacher' }) => {
  const [timetable, setTimetable] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // 模拟API数据获取
  useEffect(() => {
    setTimetable(sampleTimetable);
  }, []);

  // 切换编辑状态
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // 更新时间段的处理函数
  const handleTimeChange = (dayIndex, periodIndex, newTime) => {
    const updatedTimetable = [...timetable];
    updatedTimetable[dayIndex].periods[periodIndex].time = newTime;
    setTimetable(updatedTimetable);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pt-20">
      <h2 className="text-3xl font-bold text-center mb-6">Student Timetable</h2>
      {role === 'teacher' || role === 'admin' ? (
        <button
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={toggleEdit}
        >
          {isEditing ? 'Save Changes' : 'Edit'}
        </button>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {timetable.map((daySchedule, dayIndex) => (
          <div key={dayIndex} className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-2xl font-semibold mb-4">{daySchedule.day}</h3>
            <ul className="space-y-3">
              {daySchedule.periods.map((period, periodIndex) => (
                <li
                  key={periodIndex}
                  className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={period.time}
                      onChange={(e) => handleTimeChange(dayIndex, periodIndex, e.target.value)}
                      className="text-xl font-bold border rounded-lg p-1"
                    />
                  ) : (
                    <span className="font-medium">{period.time}</span>
                  )}
                  <span className="text-xl font-bold">{period.subject}</span>
                  <span className="text-gray-500">(Teacher: {period.teacher})</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timetable;
