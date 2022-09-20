const htmlDate = ()=>{
    const date = new Date(Date.now());
    const yy=date.getFullYear();
    const mm=(date.getMonth()+1).toString().length == 1 ? '0'+(date.getMonth()+1) : (date.getMonth()+1);
    const dd=date.getDate().toString().length == 1 ? '0'+date.getDate() : date.getDate();

    const prep = yy+'-'+mm+'-'+dd;

    return prep;
}

const htmlTime = ()=>{
    var today = new Date(Date.now());
    var hour:any = today.getHours();
    var minutes:any = today.getMinutes();
    var seconds:any = today.getSeconds();

    hour = (hour.toString().length == 1) ? '0'+hour : hour;
    minutes = (minutes.toString().length == 1) ? '0'+minutes : minutes;
    seconds = (seconds.toString().length == 1) ? '0'+seconds : seconds;

    var time = `${hour}:${minutes}:${seconds}`;

    return time;
}

export { htmlDate, htmlTime }