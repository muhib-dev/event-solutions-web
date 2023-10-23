"use client";
import { createContext, useEffect, useReducer } from "react";
import { catchError } from "@/utils/catchError";
import axios from "@/utils/axios";
import TokenService from "@/services/token.service";
import Spinner from "@/components/Spinner";

//initial State value
const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  user: "",
  login: () => {},
  logout: () => {},
  refresh: async () => {},
};

// create context
const AuthContext = createContext({ ...initialState });

// action types
const ActionTypes = {
  INIT: "INIT",
  LOGIN: "LOGIN",
  REFRESH: "REFRESH",
  LOGOUT: "LOGOUT",
};

// reducer
const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.INIT: {
      return {
        isInitialized: true,
        isAuthenticated: action.payload.isAuthenticated,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    }
    case ActionTypes.LOGIN: {
      return {
        ...state,
        isAuthenticated: true,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    }
    case ActionTypes.REFRESH: {
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    }
    case ActionTypes.LOGOUT: {
      return {
        ...state,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
      };
    }
    default: {
      return state;
    }
  }
};

// auth provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // login
  const login = async (userName, password) => {
    //TODO: aplication/x-www-form-urlencoded
    const response = await axios.post("/api/Auth/login", {
      userName,
      password,
    });

    const { accessToken, refreshToken } = response.data.data;

    // save token to local storage
    TokenService.setTokens({ refreshToken });

    dispatch({
      type: ActionTypes.LOGIN,
      payload: { accessToken, refreshToken },
    });
  };

  // logout
  const logout = async () => {
    try {
      await axios.get("/api/auth/logout");
    } catch (error) {
      console.log(error);
    } finally {
      TokenService.clearTokens();
      dispatch({ type: ActionTypes.LOGOUT });
    }
  };

  // refresh token
  const refresh = async () => {
    const oldRefreshToken = TokenService.getRefreshToken();

    if (!oldRefreshToken) return { accessToken: null, refreshToken: null };

    console.log("refreshing ...");

    try {
      const response = await axios.post("/api/auth/token/refresh", {
        refreshToken: oldRefreshToken,
      });

      const { accessToken, refreshToken } = response.data.data;

      // save token to local storage
      TokenService.setTokens({ refreshToken });

      dispatch({
        type: ActionTypes.REFRESH,
        payload: {
          accessToken,
          refreshToken,
          isAuthenticated: true,
        },
      });

      return { accessToken, refreshToken };
    } catch (error) {
      TokenService.clearTokens();

      dispatch({
        type: ActionTypes.REFRESH,
        payload: {
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        },
      });

      throw new Error(catchError(error));
    }
  };

  // init app
  const initializingApp = async () => {
    console.log("initializing ...");

    try {
      const { accessToken, refreshToken } = await refresh();

      dispatch({
        type: ActionTypes.INIT,
        payload: {
          accessToken,
          refreshToken,
          isAuthenticated: accessToken ? true : false,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.INIT,
        payload: { isAuthenticated: false },
      });
    }
  };

  useEffect(() => {
    initializingApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // show loading if not init
  if (!state.isInitialized) {
    return (
      <div className="flex justify-center items-center gap-2 my-6">
        <Spinner />
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
