import * as React from 'react';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';

const CourseItem = ({ handleAdd, course }) => {
  const [open, setOpen] = React.useState(false);
  const { subject, title, credits, schedule, instructor, days, start_time, end_time } = course
  const time = `${start_time}-${end_time}`

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div>
        <ListItem
            secondaryAction={
                <div>
                    <IconButton onClick={() => handleAdd(course, start_time, end_time, days)} edge="end" aria-label="add">
                    <AddIcon />
                    </IconButton>
                    <IconButton onClick={handleClick} edge="end" aria-label="show">
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </div>
            }
        >

            <div className="sm:pl-4 pr-8 flex sm:items-center">
                <div className="space-y-1">
                    <p className="text-base text-gray-700 font-bold tracking-wide">{`${subject}: ${title}`}</p>
                    <p className="text-sm text-gray-500 font-medium">{days} {time}</p>
                </div>
            </div>

        </ListItem>
      
        <Collapse in={open} timeout="auto" unmountOnExit className="text-gray-500 font-medium ml-8">
            <ListItemText secondary={`Subject: ${subject}`} />
            <ListItemText secondary={`Title: ${title}`} />
            <ListItemText secondary={`Credits: ${credits}`} />
            <ListItemText secondary={`Schedule: ${schedule}`} />
            <ListItemText secondary={`Instructor: ${instructor}`} />
            <ListItemText secondary={`Days: ${days}`} />
            <ListItemText secondary={`Time: ${time}`} />
        </Collapse>
    </div>
  );
}

export default CourseItem