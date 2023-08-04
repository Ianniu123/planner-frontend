import CourseItem from './listitem'
import CTabs from './tabs'

const Course = ({ course, handleAdd }) => {
    return (
      <div className="border-b-2 border-gray-100 p-2 mb-2 hover:bg-gray-200">
        <CourseItem handleAdd={handleAdd} course={course} />
      </div> 
    )
  }
  
const Display = ({ courses, handleAdd, switchTerm, value, handleChange }) => {
    return (
      <div className="border basis-2/6 p-2 border-slate-950 overflow-scroll h-screen">
        <CTabs value={value} handleChange={handleChange} switchTerm={switchTerm} />
        {courses.map(course => {
          return (
            <Course key={course.subject} course={course} handleAdd={handleAdd} />
          )
        })}
      </div>
    )
}

export default Display
