import axios from "axios";

/**
 * @param {Error} error
 * @returns {String} error message
 */
export const catchError = (error) => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.data.message;
  }

  return error;
};
