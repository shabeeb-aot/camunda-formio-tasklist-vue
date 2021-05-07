import axios from 'axios';

export function bpmAxios (bearerToken: string, CamundaUrl: any ) {
    
  return (
    axios.create({
      baseURL: CamundaUrl,
      withCredentials: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`
      }
    })
  )
}  

