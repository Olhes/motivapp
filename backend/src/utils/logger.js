const fs = require('fs');
const path = require('path');

// Crear carpeta de logs si no existe
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Niveles de log
const levels = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

// Función para escribir logs
const writeLog = (level, message) => {
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

// Métodos de logging
const logger = {
  error: (message) => writeLog(levels.ERROR, message),
  warn: (message) => writeLog(levels.WARN, message),
  info: (message) => writeLog(levels.INFO, message),
  debug: (message) => writeLog(levels.DEBUG, message),
};

module.exports = logger;
