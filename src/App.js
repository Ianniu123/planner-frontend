import { useState, useEffect } from 'react'
import service from './services/courses'

const Header = () => {
  return (
    <div className="flex flex-row overflow-auto">
      <div className="border border-slate-950 basis-4/6">
        <h1 className="text-center text-xl">Timetable</h1>
      </div>
      <div className="border border-slate-950 basis-2/6">
        <h1 className="text-center text-xl">Course Information</h1>
      </div>
    </div>
  )
}

const Cell = ({ time, day, course }) => {
  return (
    <th className="border-slate-300 border cursor-pointer">{'\u00A0'}</th>
  )
}

const Slot = ({ time }) => {
  let t = String(time)
  if (t.substring(t.indexOf(':') + 1) === "30") {
    return (
      //&nbsp
      <th className="border-r border-r-slate-300">{'\u00A0'}</th>
    )
  } else {
    return (
      <th className="border-l border-r border-t border-slate-300">{time}</th>
    )
  }
}

const Row = ({ row, time }) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
  let counter = -1
  return (
    <tr>
      <Slot key={time} time={time} />
      <th className="border-slate-300 border">{'\u00A0'}</th>
      {row.map(cell => {
        counter += 1
        return (
          <Cell key={counter} day={days[counter]} time={time} course={cell} />
        )
      })}
      <th className="border-slate-300 border">{'\u00A0'}</th>
    </tr>
  )
}

const Table = ({ selected }) => {
  const times = ["7:00", "7:30", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"]
  let idx = -1

  return (
    <table className="border-collapse table-auto h-screen basis-4/6">
      <thead>
        <tr className="border border-slate-300">
          <th width="9%"></th>
          <th width="13%">Sunday</th>
          <th width="13%">Monday</th>
          <th width="13%">Tuesday</th>
          <th width="13%">Wednesday</th>
          <th width="13%">Thursday</th>
          <th width="13%">Friday</th>
          <th width="13%">Saturday</th>
        </tr>
      </thead>

      <tbody className="border border-slate-300">
        {selected.map(row => {
          idx += 1
          return (
            <Row key={idx} row={row} time={times[idx]} />
          )
        })}
      </tbody>
    </table>
  )
}

const Course = ({ course }) => {
  let subject = course.subject
  let title = course.title
  let credits = course.credits
  let schedule = course.schedule
  let instructor = course.instructor
  let days = course.days
  let time = `${course.start_time}-${course.end_time}`

  return (
    <div className="border border-slate-300">
      <div className="ml-2">
        <h1>Subject: {subject}</h1>
        <h1>Title: {title}</h1>
        <h1>Credits: {credits}</h1>
        <h1>Schedule: {schedule}</h1>
        <h1>Instructor: {instructor}</h1>
        <h1>Days: {days}</h1>
        <h1>Time: {time}</h1>
      </div>
    </div>
  )
}

const Display = ({ courses }) => {
  return (
    <div className="border basis-2/6 place-content-center border-slate-950 overflow-scroll max-h-screen">
      {courses.map(course => {
        return (
          <Course key={course.subject} course={course} /> 
        )
      })}
    </div>
  )
}


function App() {
  const [courses, setCourses] = useState([])
  const initArray = Array(26).fill(Array(5).fill())
  const [selected, setSelected] = useState(initArray)
  const [filter, setFilter] = useState(courses)
  const [term, setTerm] = useState("fall2023")

  const hook = () => {
    console.log(term)
    service.get(term).then(response => {
      setCourses(response.data)
      setFilter(response.data)
    }).catch(error => {
      console.log('server error')
    })
  }

  useEffect(hook, [])

  return (
    <>
      <div className="justify-center">
        <Header />
        <div className="flex">
          <Table selected={selected}/>
          <Display courses={filter}/>
        </div>
      </div>
    </>
  );
}

export default App;
