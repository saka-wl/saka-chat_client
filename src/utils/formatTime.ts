
export default function formatTime(time: Date) {
    let year = time.getFullYear()
    let month = time.getMonth()
    let date = time.getDate()
    let hour = time.getHours()
    let minute = time.getMinutes()
    
    return year + '-' + month + '-' + date + ' ' + hour + ':' + minute;
}