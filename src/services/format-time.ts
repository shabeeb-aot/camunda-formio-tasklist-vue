import moment from "moment";

export const getISODateTime=(date: Date|null)=>{
    const dateTimeFormat = moment(date).format("YYYY-MM-DD[T]hh:mm:ss.SSSZ");
    const dateTimeArr = dateTimeFormat.split('+')
    if(dateTimeArr&&dateTimeArr[1]){
    const replaceTimezone = dateTimeArr[1].replace(':', '')
    return dateTimeFormat.replace(dateTimeArr[1], replaceTimezone)
    }
    else{
        return null;
    }
};
