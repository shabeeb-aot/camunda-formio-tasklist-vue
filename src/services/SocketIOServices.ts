import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import AES from 'crypto-js/aes';

let stompClient: any = null;
const BPM_BASE_URL_SOCKET_IO = 'https://bpm2.aot-technologies.com/camunda'
const token ="eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJISFJSa0toZmc2ZnNhcUlLcTZfYTMzRnltSHhGLTdObXBfT2NndF9rZkU0In0.eyJqdGkiOiJiYzNhMWIxMi1hMzYzLTQ0NGUtYWU1ZC02YzM0MGI2ZGVkYTUiLCJleHAiOjE2MTcxMTQ1ODQsIm5iZiI6MCwiaWF0IjoxNjE3MTE0Mjg0LCJpc3MiOiJodHRwczovL2lhbS5hb3QtdGVjaG5vbG9naWVzLmNvbS9hdXRoL3JlYWxtcy9mb3Jtcy1mbG93LWFpLXRlc3QiLCJhdWQiOlsiZm9ybXMtZmxvdy13ZWIiLCJjYW11bmRhLXJlc3QtYXBpIiwiYWNjb3VudCJdLCJzdWIiOiJkZTA2Y2VkNC0xODI2LTQ1YzEtYjE2Yi1kNWQwYWExZTMzOWYiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJmb3Jtcy1mbG93LXdlYiIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6IjBjZDk0ZjliLTQxZDItNDA1ZC1iODk2LWI3NjJhZWU0NjliNSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImZvcm1zLWZsb3ctd2ViIjp7InJvbGVzIjpbImZvcm1zZmxvdy1yZXZpZXdlciJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJyb2xlIjpbImZvcm1zZmxvdy1yZXZpZXdlciJdLCJuYW1lIjoiTmFuY3kgU21pdGgiLCJncm91cHMiOlsiL2NhbXVuZGEtYWRtaW4iLCIvZm9ybXNmbG93L2Zvcm1zZmxvdy1yZXZpZXdlciJdLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJuYW5jeS1zbWl0aCIsImdpdmVuX25hbWUiOiJOYW5jeSIsImZhbWlseV9uYW1lIjoiU21pdGgiLCJlbWFpbCI6Im5hbmN5LnNtaXRoQGFvdC10ZWNobm9sb2dpZXMuY29tIn0.CjhNgE8mbEisgpJzSjpuwfUJA8Oz917YKGrD42A0EXS8y1-nswAkFMhRBRowqN6t2XpX37mOmdooXDxzaYTj4vqn0YP2dlOfGKLbM6TZRwvTx7mpUjfb_6PE7lL05gJ_P_6gyDJzATIGty1mu3Mi7IKUec0h-gM5ctqDRhL1wAz9ZmhLUlHNa4OZPDq3yCy311S3uiFpAvSAxB1fFtog9peQRLr0SJv38H_-Gv9vkHjMDlA2bzMWl_oO4cptYZUgFN1UdMH20WVdK8e_SrOOXULcvCWEqX57uiPbJN-MZQns39ywFmZZppo4o10aaE7aVj0bN9WvMf-WkfFAZahbQA"
const WEBSOCKET_ENCRYPT_KEY = 'aot123'


const isConnected = ()=>{
  return stompClient?.connected||null;
};

const connect = (reloadCallback)=>{
  const accessToken= AES.encrypt(token, WEBSOCKET_ENCRYPT_KEY).toString();
  const socketUrl=`${BPM_BASE_URL_SOCKET_IO}?accesstoken=${accessToken}`;
  const socket = new SockJS(socketUrl);
  stompClient = Stomp.over(socket);
  stompClient.connect({}, function(frame){
    console.log('Connected- frame: ' + frame);
    if(isConnected()){
      stompClient.subscribe('/topic/task-event', function(output){
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