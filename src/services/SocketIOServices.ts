import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import AES from 'crypto-js/aes';

let stompClient: any = null;
const BPM_BASE_URL_SOCKET_IO = localStorage.getItem('bpmSocketUrl');
const token: any = localStorage.getItem('authToken');
const WEBSOCKET_ENCRYPT_KEY: any = localStorage.getItem('websocketEncryptkey');


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