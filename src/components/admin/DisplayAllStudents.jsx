import React from 'react'
import avatar from '../../assets/logos/avatar.jpg'

const DisplayAllStudents = ({students}) => {
  // Filter students by language
  const englishStudents = students.filter(student => student.language === 'english');
  const spanishStudents = students.filter(student => student.language === 'spanish');
  const polishStudents = students.filter(student => student.language === 'polish');

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Students by Language</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* English Students */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">English Students</h3>
          <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {englishStudents.map((student) => (
              <div key={student.id} className="p-3 mb-3 flex items-center gap-3">
                {student.avatarUrl ? (
                  <img
                    src={student.avatarUrl}
                    alt={`${student.name} ${student.lastName}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                    {`${student.name.charAt(0)}${student.lastName.charAt(0)}`}
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-800">{`${student.name} ${student.lastName}`}</span>
                  <span className="text-sm text-gray-500 block">{student.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spanish Students */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Spanish Students</h3>
          <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {spanishStudents.map((student) => (
              <div key={student.id} className="p-3 mb-3 flex items-center gap-3">
                {student.avatarUrl ? (
                  <img
                    src={student.avatarUrl}
                    alt={`${student.name} ${student.lastName}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                    {`${student.name.charAt(0)}${student.lastName.charAt(0)}`}
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-800">{`${student.name} ${student.lastName}`}</span>
                  <span className="text-sm text-gray-500 block">{student.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Polish Students */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Polish Students</h3>
          <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {polishStudents.map((student) => (
              <div key={student.id} className="p-3 mb-3 flex items-center gap-3">
                {student.avatarUrl ? (
                  <img
                    src={student.avatarUrl}
                    alt={`${student.name} ${student.lastName}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                    {`${student.name.charAt(0)}${student.lastName.charAt(0)}`}
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-800">{`${student.name} ${student.lastName}`}</span>
                  <span className="text-sm text-gray-500 block">{student.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default DisplayAllStudents;
