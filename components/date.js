import { parseISO, format } from 'date-fns'

export default function Date({ dateString }) {
  // console.log(dateString);
  // console.log(typeof dateString);
  const date = parseISO(dateString);
  return <time dateTime={dateString}>{format(date, "LLL d, yyyy")}</time>;
}
