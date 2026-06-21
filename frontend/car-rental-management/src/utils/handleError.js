export const handleApiError = (error) => {
  throw {
    status: error.response?.status,
    message: error.response?.data?.message || error.response?.data?.error || "Something went wrong",
  };
};
