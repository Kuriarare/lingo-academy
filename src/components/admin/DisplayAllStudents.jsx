import React from 'react'
import avatar from '../../assets/logos/avatar.jpg'

const DisplayAllStudents = ({students}) => {
  // Filter students by language
  const englishStudents = students.filter(student => student.language === 'english');
  const spanishStudents = students.filter(student => student.language === 'spanish');
  const polishStudents = students.filter(student => student.language === 'polish');

  return (
    <section className="flex flex-col md:flex-row gap-6 m-6 p-6 bg-gray-50 rounded-xl shadow-md justify-center">
      <div className="w-full md:w-1/3 lg:w-1/4 p-4 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 sticky top-0 bg-white z-10 p-2">English Students</h2>
        <div className="max-h-[12rem] overflow-y-auto pr-2">
          {englishStudents.map((student) => (
            <div
              key={student.id}
              className="p-3 border-l-4 border-gray-200 rounded-md mb-3 flex items-center gap-3"
            >
              <img
                src={!student.avatarUrl ? avatar : student.avatarUrl}
                alt={`${student.name} ${student.lastName}`}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <span className="font-medium text-gray-800">{`${student.name} ${student.lastName}`}</span>
                <span className="text-sm text-gray-500 block">{student.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full md:w-1/3 lg:w-1/4 p-4 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 sticky top-0 bg-white z-10 p-2">Spanish Students</h2>
        <div className="max-h-[12rem] overflow-y-auto pr-2">
          {spanishStudents.map((student) => (
            <div
              key={student.id}
              className="p-3 border-l-4 border-gray-200 rounded-md mb-3 flex items-center gap-3"
            >
              <img
                src={!student.avatarUrl ? avatar : student.avatarUrl}
                alt={`${student.name} ${student.lastName}`}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <span className="font-medium text-gray-800">{`${student.name} ${student.lastName}`}</span>
                <span className="text-sm text-gray-500 block">{student.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full md:w-1/3 lg:w-1/4 p-4 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 sticky top-0 bg-white z-10 p-2">Polish Students</h2>
        <div className="max-h-[12rem] overflow-y-auto pr-2">
          {polishStudents.map((student) => (
            <div
              key={student.id}
              className="p-3 border-l-4 border-gray-200 rounded-md mb-3 flex items-center gap-3"
            >
              <img
                src={!student.avatarUrl ? avatar : student.avatarUrl}
                alt={`${student.name} ${student.lastName}`}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <span className="font-medium text-gray-800">{`${student.name} ${student.lastName}`}</span>
                <span className="text-sm text-gray-500 block">{student.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DisplayAllStudents;
