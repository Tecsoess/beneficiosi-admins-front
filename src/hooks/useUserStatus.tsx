import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Options, RefetchOptions } from 'axios-hooks';
import { useEffect, useState } from 'react';
import useAxios from './useAxios';

type useUserStatusParams = {
  options?: undefined | Options;
  axiosConfig?: AxiosRequestConfig | undefined;
}

type useUserStatusReturnType = [
  {
    userStatus: any[];
    total: number;
    error: AxiosErrorType;
    loading: boolean;
    numberOfPages: number;
    size: number;
  },
  (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>
]

type AxiosErrorType = AxiosError<any> | undefined;

const useUserStatus = ({ options, ...axiosConfig }: useUserStatusParams = {}): useUserStatusReturnType => {

  const [{ data, error, loading }, getUserStatus] = useAxios({ url: '/user-statuses', ...axiosConfig }, { useCache: false, ...options });

  const [userStatus, setUserStatus] = useState([]);
  const [total, setTotal] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [size, setSize] = useState(0);

  useEffect(() => {
    if (data) {
      setUserStatus(data.results);
      setTotal(data.total);
      setNumberOfPages(data.numberOfPages);
      setSize(data.size);
    }
  }, [data]);

  return [{ userStatus, size, total, numberOfPages, error, loading }, getUserStatus];
};

export default useUserStatus;
