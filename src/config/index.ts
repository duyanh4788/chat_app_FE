export const config = {
  NODE_ENV: process.env.REACT_APP_NODE_ENV,
  PORT: process.env.REACT_APP_PORT,
  CHAT_API_URL: process.env.REACT_APP_CHAT_API_URL,
  DOMAIN_URL: process.env.REACT_APP_DOMAIN_URL,
  PATH_SOCKET: process.env.REACT_APP_PATH_SOCKET,
  BASE_URL: process.env.REACT_APP_BASE_URL,
};

export const baseProps = config.NODE_ENV === 'production' ? { basename: config.BASE_URL } : {};
