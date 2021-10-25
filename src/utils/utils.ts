import dayjs from "dayjs"

export const parseDate = (d: dayjs.ConfigType) => {
  const day = dayjs(d)
  
  return {
    value: day.toDate(),
    year: day.year(),
    month: day.month(),
    date: day.date(),
    day: day.day(),
  }
}