import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

// Respuesta exitosa (200)
export const successResponse = <T>(res: Response, data: T, message?: string): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
    timestamp: new Date().toISOString(),
  };
  res.status(200).json(response);
};

// Respuesta creada (201)
export const createdResponse = <T>(res: Response, data: T, message?: string): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
    timestamp: new Date().toISOString(),
  };
  res.status(201).json(response);
};

// Respuesta de no autorizado (401)
export const unauthorizedResponse = (res: Response, message: string): void => {
  const response: ApiResponse = {
    success: false,
    error: 'Unauthorized',
    message,
    timestamp: new Date().toISOString(),
  };
  res.status(401).json(response);
};

// Respuesta de mala solicitud (400)
export const badRequestResponse = (res: Response, message: string): void => {
  const response: ApiResponse = {
    success: false,
    error: 'Bad Request',
    message,
    timestamp: new Date().toISOString(),
  };
  res.status(400).json(response);
};

// Respuesta de error del servidor (500)
export const errorResponse = (res: Response, message: string, error?: string): void => {
  const response: ApiResponse = {
    success: false,
    error: error || 'Internal Server Error',
    message,
    timestamp: new Date().toISOString(),
  };
  res.status(500).json(response);
};

// Respuesta de no encontrado (404)
export const notFoundResponse = (res: Response, message: string): void => {
  const response: ApiResponse = {
    success: false,
    error: 'Not Found',
    message,
    timestamp: new Date().toISOString(),
  };
  res.status(404).json(response);
};

// Respuesta de prohibido (403)
export const forbiddenResponse = (res: Response, message: string): void => {
  const response: ApiResponse = {
    success: false,
    error: 'Forbidden',
    message,
    timestamp: new Date().toISOString(),
  };
  res.status(403).json(response);
};
