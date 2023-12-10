import originalAxios from "axios";


const baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

const axios = () => {
  const defaultOptions = {
    baseURL,
  };

  const ignorePaths = [
    "/location/share-current-location",
    "/location/share-vehicle-route",
    "/signin",
    "/signup",
  ];

  const instance = originalAxios.create(defaultOptions);

  instance.interceptors.request.use(async (request) => {
    try {
      const jsonString = localStorage.getItem("persist:root");
      const data = jsonString && JSON.parse(JSON.parse(jsonString)?.auth);
      const token = data?.token;

      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error while setting Authorization header:", error);
    }

    return request;
  });

  instance.interceptors.response.use(
    async (response) => response,
    async (error) => {
      if (
        error.response?.status === 401 &&
        !ignorePaths.includes(location.pathname)
      ) {
        localStorage.removeItem("persist:root");
        location.replace("/signin");
      } else {
        return Promise.reject(error);
      }
    }
  );

  return instance;
};

export default axios();
