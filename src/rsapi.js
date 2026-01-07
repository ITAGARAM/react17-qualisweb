import axios from 'axios';
import store from './store';
import CryptoJS from "crypto-js";
import { NetworkEncryption } from './components/Enumeration';

const SECRET_KEY = NetworkEncryption.SECRET_KEY;

//BGSI Source only - Removed max LIMS Screens
const baseURL = 'http://localhost:4001/QuaLIS';
//const baseURL = window.location.origin + '/QuaLIS';

//npm install-25 min
//npm start-max -30min
//npm build - 5min


function encryptPayload(payload) {
  if (payload && !(payload instanceof FormData)) {
    const json = JSON.stringify(payload);
    const ciphertext = CryptoJS.AES.encrypt(json, SECRET_KEY).toString();
    return { data: ciphertext };
  } else {
    return payload;
  }
}

function decryptResponse(ciphertext) {
  if (ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } else {
    return ciphertext;
  }
}

export const rsapi = () => {
  const state = store.getState();
  const Login = state ? state.Login : undefined;
  const token = Login && Login.token ? Login.token : '';

  const api = axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Request-Token': crypto.randomUUID()
    }
  });

  api.interceptors.request.use(config => {
    if (config.data) {
      config.data = encryptPayload(config.data);
    }
    return config;
  });

   api.interceptors.response.use(response => {
    if (response.data && typeof response.data === 'object') {
      response.data = decryptResponse(response.data.data);
    }
    return response;
    },
    error => {
      if (error.response?.data 
        && typeof error.response.data === 'object'
      ) {
        error.response.data = decryptResponse(error.response.data.data);
      }
      return Promise.reject(error);
    }
  );

  return api;
};


export const serverUrl = () => {
  return baseURL
}

export const clientUrl = () => {
  return baseURL
}

export const fileViewUrl = () => {
  //return 'http://localhost:8888'
  return window.location.origin
}

export const reportUrl = () => {
  //return 'http://localhost:9397' + '/JavaReportingTool/';
  return window.location.origin + '/JavaReportingTool/';
}

export default rsapi;