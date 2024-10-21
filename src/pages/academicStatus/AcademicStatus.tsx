import { useState, useEffect, ChangeEvent } from 'react';

interface AcademicStatus {
  status: string;
  studentId: string;
  enrollmentDate: string;
  graduationDate?: string | null;
  photo?: File | string | null;
}

interface Student {
  id: number;
  name: string;
  academicStatus: AcademicStatus;
}

interface AcademicStatusProps {
  role?: 'teacher' | 'admin' | 'student';
}

const sampleStudent: Student = {
  id: 1,
  name: 'John Doe',
  academicStatus: {
    status: 'Enrolled',
    studentId: '20220001',
    enrollmentDate: '2022-09-01',
    graduationDate: null,
    photo: null, // 初始状态无照片
  }
};

const AcademicStatus: React.FC<AcademicStatusProps> = ({ role = 'teacher' }) => {
  const [student, setStudent] = useState<Student>(sampleStudent);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null); // 预览图片

  useEffect(() => {
    setStudent(sampleStudent);
  }, []);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudent((prevState) => ({
      ...prevState,
      academicStatus: {
        ...prevState.academicStatus,
        [name]: value
      }
    }));
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const photoURL = URL.createObjectURL(file);
      setPreviewPhoto(photoURL); // 预览图片
      setStudent((prevState) => ({
        ...prevState,
        academicStatus: {
          ...prevState.academicStatus,
          photo: file // 将图片文件保存
        }
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-6">Student Academic Status</h2>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="mb-4">
          <label className="block text-lg font-semibold">Student Name:</label>
          <p>{student.name}</p>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">Student ID:</label>
          {isEditing ? (
            <input
              type="text"
              name="studentId"
              value={student.academicStatus?.studentId || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            />
          ) : (
            <p>{student.academicStatus?.studentId}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">Enrollment Date:</label>
          {isEditing ? (
            <input
              type="date"
              name="enrollmentDate"
              value={student.academicStatus?.enrollmentDate || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            />
          ) : (
            <p>{student.academicStatus?.enrollmentDate}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">Status:</label>
          {isEditing ? (
            <select
              name="status"
              value={student.academicStatus?.status || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="Enrolled">Enrolled</option>
              <option value="Graduated">Graduated</option>
              <option value="Dropped">Dropped</option>
            </select>
          ) : (
            <p>{student.academicStatus?.status}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">Photo:</label>
          {isEditing ? (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="mb-2"
              />
              {previewPhoto && (
                <img
                  src={previewPhoto}
                  alt="Preview"
                  className="w-32 h-32 object-cover border rounded-lg"
                />
              )}
            </>
          ) : (
            <img
              src={typeof student.academicStatus.photo === 'string' ? student.academicStatus.photo : 'https://via.placeholder.com/150'}
              alt="Student"
              className="w-32 h-32 object-cover border rounded-lg"
            />
          )}
        </div>

        {role === 'admin' || role === 'teacher' ? (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={toggleEdit}
          >
            {isEditing ? 'Save Changes' : 'Edit'}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default AcademicStatus;
