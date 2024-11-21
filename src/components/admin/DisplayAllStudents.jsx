import React from 'react'
import avatar from '../../assets/logos/avatar.jpg'

const DisplayAllStudents = ({students}) => {
  // Filter students by language
  const englishStudents = students.filter(student => student.language === 'english');
  const spanishStudents = students.filter(student => student.language === 'spanish');
  const polishStudents = students.filter(student => student.language === 'polish');

  return (
    <section className="flex flex-col md:flex-row gap-4 m-6 p-4 box-shadow-form">
      <div className="w-1/4 max-h-[12rem] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 sticky top-0 bg-white z-10 p-2">English Students</h2>
        {englishStudents.map((student) => (
          <div
            key={student.id}
            className="p-2 border rounded-md cursor-pointer mb-2 flex items-center gap-2"
          >
            <img
              src={!student.avatarUrl ? avatar : student.avatarUrl}
              alt={`${student.name} ${student.lastName}`}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <span className="font-medium">{`${student.name} ${student.lastName}`}</span>
              <span className="text-sm text-gray-500 block">{student.email}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="w-1/4 max-h-[12rem] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 sticky top-0 bg-white z-10 p-2">Spanish Students</h2>
        {spanishStudents.map((student) => (
          <div
            key={student.id}
            className="p-2 border rounded-md cursor-pointer mb-2 flex items-center gap-2"
          >
            <img
              src={!student.avatarUrl ? avatar : student.avatarUrl}
              alt={`${student.name} ${student.lastName}`}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <span className="font-medium">{`${student.name} ${student.lastName}`}</span>
              <span className="text-sm text-gray-500 block">{student.email}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="w-1/4 max-h-[12rem] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 sticky top-0 bg-white z-10 p-2">Polish Students</h2>
        {polishStudents.map((student) => (
          <div
            key={student.id}
            className="p-2 border rounded-md cursor-pointer mb-2 flex items-center gap-2"
          >
            <img
              src={!student.avatarUrl ? avatar : student.avatarUrl}
              alt={`${student.name} ${student.lastName}`}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <span className="font-medium">{`${student.name} ${student.lastName}`}</span>
              <span className="text-sm text-gray-500 block">{student.email}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default DisplayAllStudents;
