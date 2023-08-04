import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

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

export default Table;