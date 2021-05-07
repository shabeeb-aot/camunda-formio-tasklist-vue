import moment from "moment";

export const getISODateTime=(date: Date|null)=>{
  if(date){
    return moment(date).format('YYYY-MM-DD[T]HH:mm:ss.SSSZZ');
  }
}

export const getFormattedDateAndTime = (date: Date)=>{

  return new Date(date).toLocaleDateString('en-us',  {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});

};

export const getLocalDateTime = (date: any) => {
  return date?new Date(date.replace(' ','T')+'Z').toLocaleString(): "-";
}
