function checkLessDay(day) {
  if (day < 10) {
    return {
      firstDay: 0,
      lastDay: day
    }
  } else {
   let split_day =  `${day}`.split('')
   return {
     firstDay: split_day[0],
     lastDay: split_day[1]
   }
  }
}

export  {
  checkLessDay
}