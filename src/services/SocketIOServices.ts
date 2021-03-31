import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import AES from 'crypto-js/aes';

let stompClient: any = null;
const BPM_BASE_URL_SOCKET_IO = 'https://bpm2.aot-technologies.com/camunda/forms-flow-bpm-socket'
const token ="eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJISFJSa0toZmc2ZnNhcUlLcTZfYTMzRnltSHhGLTdObXBfT2NndF9rZkU0In0.eyJqdGkiOiI0YjY5MTg3ZS1jMTNkLTQ5MGUtODk3My1hMDYxNTEyZWYxODQiLCJleHAiOjE2MTcyMDE1OTksIm5iZiI6MCwiaWF0IjoxNjE3MjAxMjk5LCJpc3MiOiJodHRwczovL2lhbS5hb3QtdGVjaG5vbG9naWVzLmNvbS9hdXRoL3JlYWxtcy9mb3Jtcy1mbG93LWFpLXRlc3QiLCJhdWQiOlsiZm9ybXMtZmxvdy13ZWIiLCJjYW11bmRhLXJlc3QtYXBpIiwiYWNjb3VudCJdLCJzdWIiOiJkZTA2Y2VkNC0xODI2LTQ1YzEtYjE2Yi1kNWQwYWExZTMzOWYiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJmb3Jtcy1mbG93LXdlYiIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6IjIxOTM5OWQ0LWI4NGYtNDVkZS1hOTUwLWZmYzg0MmYxZTRiMSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImZvcm1zLWZsb3ctd2ViIjp7InJvbGVzIjpbImZvcm1zZmxvdy1yZXZpZXdlciJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJyb2xlIjpbImZvcm1zZmxvdy1yZXZpZXdlciJdLCJuYW1lIjoiTmFuY3kgU21pdGgiLCJncm91cHMiOlsiL2NhbXVuZGEtYWRtaW4iLCIvZm9ybXNmbG93L2Zvcm1zZmxvdy1yZXZpZXdlciJdLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJuYW5jeS1zbWl0aCIsImdpdmVuX25hbWUiOiJOYW5jeSIsImZhbWlseV9uYW1lIjoiU21pdGgiLCJlbWFpbCI6Im5hbmN5LnNtaXRoQGFvdC10ZWNobm9sb2dpZXMuY29tIn0.TNEuD2pKLhxLGIrXrqiGBTrtjjnLeGzQ3_91IGze1EtW0eWPYIPPGl8iAuYKsyZNptQ6fBWEnZmu24KoyMRP8dOT9YgSztg-GzXXG8KzmiEB5kp1FgVDVv4hZakgiZmP64ch_J3XnOyuPBAdFIYxCo-dVI9mPZ2pLTRa7axyiv6KL7jJfrz5ZmMFk6Yl0GseMqHewn_hm1bKThUQ147OWA3W0n8-O3RA8A15w1SZUZMnII5Vu-O3YpfWzTyilAQPJCiVxC6p9r_A4ioBFSDVE70n-YpuF6ah7X6aur--VTbkanIOfVniAu9Ynbz5d1RenPkbzO_rB6fB7aB3eig0SQ"
const WEBSOCKET_ENCRYPT_KEY = 'aot123'


const isConnected = ()=>{
  return stompClient?.connected||null;
};

const connect = (reloadCallback: any)=>{
  const accessToken= AES.encrypt(token, WEBSOCKET_ENCRYPT_KEY).toString();
  const socketUrl=`${BPM_BASE_URL_SOCKET_IO}?accesstoken=${accessToken}`;
  const socket = new SockJS(socketUrl);
  stompClient = Stomp.over(socket);
  stompClient.connect({}, function(frame: any){
    console.log('Connected- frame: ' + frame);
    if(isConnected()){
      stompClient.subscribe('/topic/task-event', function(output: any){
        const taskUpdate = JSON.parse(output.body);
        reloadCallback(taskUpdate.id);
      });
    }
  });
}

const disconnect = ()=>{
  stompClient.disconnect();
  console.log("Disconnected");
}

const SocketIOService = {
  connect,
  disconnect,
  isConnected
};

export default SocketIOService;