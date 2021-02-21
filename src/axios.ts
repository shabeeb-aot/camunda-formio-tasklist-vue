import axios from 'axios';

export function bpmAxios () {
    
  return (
    axios.create({
      baseURL: 'http://localhost:8080/engine-rest',
      withCredentials: false,
    })
  )
}  

