import { useState, useEffect } from 'react'
import service from './services/courses'
import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dial from './components/dialog'
import CourseItem from './components/listitem'

const Header = ({ switchTerm, term }) => {
  return (
    <div className="flex flex-row overflow-auto">
      <div className="border flex border-slate-950 basis-4/6">
        <button onClick={switchTerm} className="basis">switch term</button>
        <h1 className="text-center text-xl">Timetable</h1>
      </div>
      <div className="border border-slate-950 basis-2/6">
        <h1 className="text-center text-xl">Course Information: {term}</h1>
      </div>
    </div>
  )
}

const Cell = ({ time, day, course, handleClick, handleRemove}) => {
  if (course !== undefined) {
    return (
      <th className="border-slate-300 border hover:bg-sky-500 ">
        <ListItem
          secondaryAction={
            <IconButton onClick={() => handleRemove(course)} edge="end" aria-label="delete">
              <ClearIcon fontSize="small" />
            </IconButton>
          }
        >
          <ListItemText onClick={() => handleClick(time, day)} primaryTypographyProps={{fontSize: '14px'}}  primary={course.subject} className="cursor-pointer" />
        </ListItem>
      </th>
    )
  } else {
    return (
      <th className="border-slate-300 border hover:bg-sky-500">
        <ListItem>
          <ListItemText onClick={() => handleClick(time, day)} primaryTypographyProps={{fontSize: '14px'}}  primary={'\u00A0'} className="cursor-pointer" />
        </ListItem>
      </th>
    )
  }
}

const Slot = ({ time }) => {
  let t = String(time)
  if (t.substring(t.indexOf(':') + 1) === "30") {
    return (
      <th className="border-r border-r-slate-300">&nbsp;</th>
    )
  } else {
    return (
      <th className="border-l border-r border-t border-slate-300">{time}</th>
    )
  }
}

const Row = ({ row, time, handleClick, handleRemove }) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
  let counter = -1
  return (
    <tr>
      <Slot key={time} time={time} />
      <th className="border-slate-300 border"></th>
      {row.map(cell => {
        counter += 1
        return (
          <Cell key={counter} day={days[counter]} time={time} course={cell} handleClick={handleClick} handleRemove={handleRemove} />
        )
      })}
      <th className="border-slate-300 border"></th>
    </tr>
  )
}

const Table = ({ selected, handleClick, handleRemove }) => {
  const times = [
    "7:00", "7:30", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00",
    "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
  ]
  let idx = -1
  let counter = 100

  return (
    <table className="border-collapse basis-4/6 table-auto h-screen w-full">
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
        {selected.map((row, index) => {
          idx += 1
          counter += 1
          return (
            <Row key={counter} row={row} time={times[idx]} handleClick={handleClick} handleRemove={handleRemove} />
          )
        })}
      </tbody>
    </table>
  )
}

const Course = ({ course, handleAdd }) => {
  return (
    <div className="border-b-2 border-gray-100 p-2 mb-2 hover:bg-gray-200">
      <CourseItem handleAdd={handleAdd} course={course} />
    </div> 
  )
}

const Display = ({ courses, handleAdd }) => {
  return (
    <div className="border basis-2/6 p-2 border-slate-950 overflow-scroll h-screen">
      
      {courses.map(course => {
        return (
          <Course key={course.subject} course={course} handleAdd={handleAdd} />
        )
      })}
    </div>
  )
}

//Animations 
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


function App() {
  const [courses, setCourses] = useState([]) // Array to store all courses
  const initArray = Array(28).fill(Array(5).fill())
  const [selected, setSelected] = useState(initArray) //keeps track of all the courses in the selected time table
  const [filter, setFilter] = useState(courses)
  const [term, setTerm] = useState("fall2023")
  const [myCourses, setMyCourses] = useState([])
  const [openDialog, setOpenDialog] = useState(false) //tracks whether dialog box is openned
  const [openNotif, setOpenNotif] = useState(false)
  const [current, setCurrent] = useState([]) //keeps track of the current cell being selected [time, day]

  let success = true

  const switchTerm = () => {
    const newTerm = term === "fall2023" ? "winter2024": "fall2023"
    setTerm(newTerm)
    try {
      service.get(term).then(response => {
        setCourses(response.data);
        setFilter(response.data);
        setSelected(initArray)
        setMyCourses([])
        setOpenDialog(false)
        setOpenNotif(false)
        setCurrent([])
      })
    } catch (error) {
      console.log('server error');
    }
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAcceptDialog =() => {
    //handles saying yes to repalce the existing course

    setOpenDialog(false)
  }

  const handleCloseNotif = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenNotif(false)
  }

  const updateValue = (i, j, newValue) => {
    setSelected(selected => {
      const newArray = selected.concat()
      newArray[i] = newArray[i].concat()

      if (newArray[i][j] !== undefined) {
        setOpenDialog(true)
        success = false
        return newArray
        // prevents the rest from executing
      }

      success = true
      newArray[i][j] = newValue
      return newArray
    })

    return success
  }

  const handleRemove = (course) => {
    const newMyCourses = myCourses.filter(c => c.subject !== course.subject)
    const newSelected = selected.map(row => row.map(c => {
      if (c === undefined) {
        return undefined
      } 
        return c.subject === course.subject ? undefined : c
      })
    )
    
    //fix filter after removing course from table

    setSelected(newSelected)
    setMyCourses(newMyCourses)
  }

  const handleAdd = (course, start_time, end_time, day) => {
    const times = [
      "700", "730", "800", "830", "900", "930", "1000", "1030", "1100", "1130",
      "1200", "1230", "1300", "1330", "1400", "1430", "1500", "1530", "1600",
      "1630", "1700", "1730", "1800", "1830", "1900", "1930", "2000", "2030"
    ];
    const week = ["Mon", "Tue", "Wed", "Thu", "Fri"]
    const start = parseInt(start_time.replace(':', ''))
    const end = parseInt(end_time.replace(':', ''))
    const days = day.split(' ', 2)

    let start_idx = -1
    let end_idx = -1

    // calculates starting idx (-1 ok because no class starts at 20:30 generally)
    for (let i = 0; i < times.length - 1; i++) {
      if (start >= times[i] && start <= times[i + 1]) {
        start_idx = i;
        break;
      }
    }

    // calculates ending idx
    for (let i = 0; i < times.length - 1; i++) {
      if (end >= times[i] && end <= times[i + 1]) {
        end_idx = i;
        break;
      }
    }

    days.forEach(day => {
      for (let i = start_idx; i <= end_idx; i++) {
        if (updateValue(i, week.indexOf(day), course) === false) {
          console.log("failed to add course")
          return;
        }
      }
    });

    if (success) {
      const newMyCourses = myCourses.concat(course)
      setFilter(filter.filter(c => course.id !== c.id));
      setMyCourses(newMyCourses)
      setOpenNotif(true)
    }

  }

  const handleClick = (time, day) => {
    if (time === current[0] && day === current[1]) {
      setFilter(courses.concat())
      const newCurrent = [undefined, undefined]
      setCurrent(newCurrent)
      return
    }


    const newList = courses.filter(course => {
      const lower = parseInt(time.replace(':', '')); //lower bound
      const upper = lower % 100 === 0 ? lower + 30 : lower + 70;
      const start = parseInt(course.start_time.replace(':', ''));
      const end = parseInt(course.end_time.replace(':', ''));
      return course.days.includes(day) && start >= lower && start <= upper && !myCourses.includes(course);
    });

    const newCurrent = [time, day]
    setCurrent(newCurrent)
    setFilter(newList);

  }

  const fetchCourses = async () => {
    try {
      service.get(term).then(response => {
        setCourses(response.data);
        setFilter(response.data);
      })
    } catch (error) {
      console.log('server error');
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="justify-center">
      <Header switchTerm={switchTerm} term={term} />
      <div className="flex w-full">
        <Table selected={selected} handleClick={handleClick} handleRemove={handleRemove} />

        <Display courses={filter} handleAdd={handleAdd} />

        <Dial openDialog={openDialog} handleCloseDialog={handleCloseDialog} handleAcceptDialog={handleAcceptDialog} />

        <Snackbar open={openNotif} autoHideDuration={6000} onClose={handleCloseNotif}>
          <Alert onClose={handleCloseNotif} severity="success" sx={{ width: '100%' }}>
            Successfully added the course!
          </Alert>
        </Snackbar>

      </div>
    </div>
  );
}

export default App;
