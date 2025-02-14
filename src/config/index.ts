export const config = {
  NODE_ENV: process.env.REACT_APP_NODE_ENV,
  PORT: process.env.REACT_APP_PORT,
  CHAT_API_URL: process.env.REACT_APP_CHAT_API_URL,
  SOCKET_URL: process.env.REACT_APP_SOCKET_API_URL,
  BASE_URL: process.env.REACT_APP_BASE_URL,
};
export const baseProps = config.NODE_ENV === 'production' ? { basename: config.BASE_URL } : {};
