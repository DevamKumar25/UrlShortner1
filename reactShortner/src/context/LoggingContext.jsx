import { createContext, useContext } from "react";

const LoggingContext = createContext();

export const LoggingProvider = ({ children }) => {
  const log = (level, message, data = {}) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
    };

    console.log(`[${level}] ${timestamp}: ${message}`, data);
  };

  const logger = {
    info: (message, data) => log("INFO", message, data),
    warn: (message, data) => log("WARN", message, data),
    error: (message, data) => log("ERROR", message, data),
    debug: (message, data) => log("DEBUG", message, data),
  };

  return (
    <LoggingContext.Provider value={logger}>{children}</LoggingContext.Provider>
  );
};

export const useLogger = () => {
  const context = useContext(LoggingContext);
  if (!context) {
    throw new Error("useLogger must be used within a LoggingProvider");
  }
  return context;
};
