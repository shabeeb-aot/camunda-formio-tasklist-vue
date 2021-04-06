import axios from 'axios';


export const httpPOSTRequest = (url: string, data: any, token: string, isBearer = true) => {
    return axios.post(url, data, {
      headers: {
        Authorization: isBearer
          ? `Bearer ${token}`
          : token,
      },
    });
  };

export const formApplicationSubmit = (Apiurl: string, data: any, token: string) => {
    return httpPOSTRequest(Apiurl + "/application/create", data, token)
}