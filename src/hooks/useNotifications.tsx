import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Options, RefetchOptions } from 'axios-hooks';
import { useEffect, useState } from 'react';
import useAxios from './useAxios';

type useNotificationsParams = {
  options?: undefined | Options;
  axiosConfig?: AxiosRequestConfig | undefined;
}

type useNotificationsReturnType = [
  {
    notifications: any[];
    total: number;
    error: AxiosErrorType;
    loading: boolean;
    numberOfPages: number;
    size: number;
  },
  (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>
]

type AxiosErrorType = AxiosError<any> | undefined;

const useNotifications = ({ options, ...axiosConfig }: useNotificationsParams = {}): useNotificationsReturnType => {

  const [{ data, error, loading }, getNotifications] = useAxios({ url: '/notifications', ...axiosConfig }, { useCache: false, ...options });

  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [size, setSize] = useState(0);

  useEffect(() => {
    if (data) {
      setNotifications(data.results);
      setTotal(data.total);
      setNumberOfPages(data.numberOfPages);
      setSize(data.size);
    }
  }, [data]);

  return [{ notifications, total, size, numberOfPages, error, loading }, getNotifications];
};

export default useNotifications;
