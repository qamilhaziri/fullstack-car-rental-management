export default  handleApiError = (error) => {
    throw {
        status: error.response?.status,
        message:
            error.response?.data?.message ||
            "Something went wrong"
    };
};