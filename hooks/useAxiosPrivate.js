import { useEffect } from "react";
import axiosInstance from "@/utils/axios";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
  const { accessToken, refresh } = useAuth();

  useEffect(() => {
    const interceptors = axiosInstance.interceptors;
    const requestIntercept = interceptors.request.use(
      (config) => {
        config.headers = config.headers ?? {};

        if (!config.headers["Authorization"]) {
          if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        //TODO: check status === 403 also
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;

          const responseRefresh = await refresh();

          if (responseRefresh) {
            const newToken = responseRefresh.accessToken;
            prevRequest.headers["Authorization"] = `Bearer ${newToken}`;
          }

          return axiosInstance(prevRequest);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      interceptors.request.eject(requestIntercept);
      interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, refresh]);

  return axiosInstance;
};

export default useAxiosPrivate;
