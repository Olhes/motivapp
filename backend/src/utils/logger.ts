import fs from 'fs';
import path from 'path';

// Crear carpeta de logs si no existe
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Niveles de log
const levels = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
} as const;

type LogLevel = typeof levels[keyof typeof levels];

// Función para escribir logs
const writeLog = (level: LogLevel, message: string): void => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${level}: ${message}\n`;
  
  // Escribir en archivo principal
  fs.appendFileSync(path.join(logsDir, 'app.log'), logEntry);
  
  // Escribir en archivo específico por nivel
  if (level === levels.ERROR) {
    fs.appendFileSync(path.join(logsDir, 'error.log'), logEntry);
  } else if (level === levels.WARN) {
    fs.appendFileSync(path.join(logsDir, 'access.log'), logEntry);
  }
  
  // Mostrar en consola
  console.log(logEntry.trim());
};

// Interfaz del logger
export interface Logger {
  error: (message: string) => void;
  warn: (message: string) => void;
  info: (message: string) => void;
  debug: (message: string) => void;
}

// Métodos de logging
const logger: Logger = {
  error: (message: string) => writeLog(levels.ERROR, message),
  warn: (message: string) => writeLog(levels.WARN, message),
  info: (message: string) => writeLog(levels.INFO, message),
  debug: (message: string) => writeLog(levels.DEBUG, message),
};

export default logger;
