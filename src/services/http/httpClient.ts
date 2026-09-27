import axios from 'axios';
import { API_BASE_URL } from '../config';
import { attachMsalInterceptor } from './msalInterceptor';

/** Instancia HTTP única hacia AWS API Gateway (mismo dominio del frontend en AWS). */
export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

attachMsalInterceptor(httpClient);
