
export default function formatTime(time: Date) {
    let year = time.getFullYear()
    let month = time.getMonth()
    let date = time.getDate()
    let hour = time.getHours()
    let minute = time.getMinutes()
    
    return year + '-' + month + '-' + date + ' ' + hour + ':' + minute;
}

export const formatDate = (date: number) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hour = d.getHours();
    const minutes = d.getMinutes();
    return year + '年' + month + '月' + day + '日' + ' ' + hour + '点' + minutes + '分';
}