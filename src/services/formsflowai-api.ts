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

export const httpGETRequest = (url: string, data: any, token: string, isBearer = true) => {
  return axios.get(url, {
    params: data,
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

export const getformHistoryApi = (ApiUrl: string, applicationId: string,  token: string) => {
  return httpGETRequest(ApiUrl+"/application/"+applicationId+"/history",{}, token)
}
