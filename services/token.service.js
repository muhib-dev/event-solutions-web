import jwt_decode from "jwt-decode";

const refreshTokenKey = "refresh_token";
const isClient = typeof window !== "undefined";

const getRefreshToken = () => {
  if (!isClient) return null;
  return localStorage.getItem(refreshTokenKey);
};

const setTokens = ({ refreshToken }) => {
  if (!refreshToken) return;

  if (isClient) {
    localStorage.setItem(refreshTokenKey, refreshToken);
  }
};

const clearTokens = () => {
  if (isClient) {
    localStorage.removeItem(refreshTokenKey);
  }
};

const getTokenInfo = (token) => {
  if (!token) return null;

  if (isClient) {
    return jwt_decode(token);
  }
};

const TokenService = {
  getRefreshToken,
  setTokens,
  clearTokens,
  getTokenInfo,
};

export default TokenService;
