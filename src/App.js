import { useState, useEffect } from 'react'
import service from './services/courses'
import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dial from './components/dialog'
import Table from './components/table'
import Display from './components/display'

const Header = ({ term }) => {
  return (
    <div className="flex flex-row overflow-auto">
      <div className="border border-slate-950 basis-4/6">
        <h1 className="text-center text-xl">Timetable</h1>
      </div>
      <div className="border border-slate-950 basis-2/6">
        <h1 className="text-center text-xl">Course Information: {term}</h1>
      </div>
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
  //const [openDialog, setOpenDialog] = useState(false) //tracks whether dialog box is openned
  const [openSuccess, setOpenSuccess] = useState(false)
  const [openFail, setOpenFail] = useState(false)
  const [openSwitch, setOpenSwitch] = useState(false)
  const [current, setCurrent] = useState([]) //keeps track of the current cell being selected [time, day]
  const [value, setValue] = useState('one');
  let success = true


  const switchTerm = () => {
    const newTerm = term === "fall2023" ? "winter2024": "fall2023"
    setTerm(newTerm)
    setOpenSwitch(true)
    try {
      service.get(term).then(response => {
        setCourses(response.data);
        setFilter(response.data);
        setSelected(initArray)
        setMyCourses([])
        //setOpenDialog(false)
        setOpenSuccess(false)
        setCurrent([])
      })
    } catch (error) {
      console.log('server error');
    }
  }

  const handleChange = (event, newValue) => {
    if (newValue === 'one') {
      setFilter(courses.filter(course => {
        return myCourses.includes(course) === false
      }))
    } else {
      setFilter(myCourses.concat())
    }

    setValue(newValue);
  };


  const handleCloseSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSuccess(false)
  }

  const handleCloseFail = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenFail(false)
  }

  const handleCloseSwitch = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSwitch(false)
  }

  const updateValue = (i, j, newValue) => {
    setSelected(selected => {
      const newArray = selected.concat()
      newArray[i] = newArray[i].concat()

      if (newArray[i][j] !== undefined) {
        setOpenFail(true)
        success = false
        return newArray
      } else {
        newArray[i][j] = newValue
        return newArray
      }
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
      setOpenSuccess(true)
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
      <Header term={term} />
      <div className="flex w-full">
        <Table selected={selected} handleClick={handleClick} handleRemove={handleRemove} />

        <Display courses={filter} handleAdd={handleAdd} value={value} handleChange={handleChange} switchTerm={switchTerm} />

        <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
          <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
            Successfully added the course!
          </Alert>
        </Snackbar>

        <Snackbar open={openFail} autoHideDuration={6000} onClose={handleCloseFail}>
          <Alert onClose={handleCloseFail} severity="error" sx={{ width: '100%' }}>
            A course already exists in this slot, please remove the existing course before adding a new one!
          </Alert>
        </Snackbar>

        <Snackbar open={openSwitch} autoHideDuration={6000} onClose={handleCloseSwitch}>
          <Alert onClose={handleCloseSwitch} severity="success" sx={{ width: '100%' }}>
            switched to term {term}
          </Alert>
        </Snackbar>

      </div>
    </div>
  );
}

export default App;
