import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Options, RefetchOptions } from 'axios-hooks';
import { useEffect, useState } from 'react';
import useAxios from './useAxios';

type useHelpsParams = {
  options?: undefined | Options;
  axiosConfig?: AxiosRequestConfig | undefined;
}

type useHelpsReturnType = [
  {
    helps: any[];
    total: number;
    error: AxiosErrorType;
    loading: boolean;
    numberOfPages: number;
  },
  (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>
]

type AxiosErrorType = AxiosError<any> | undefined;

const useHelps = ({ options, ...axiosConfig }: useHelpsParams = {}): useHelpsReturnType => {

  const [{ data, error, loading }, getHelps] = useAxios({ url: '/helps', ...axiosConfig }, { useCache: false, ...options });

  const [helps, setHelps] = useState([]);
  const [total, setTotal] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setHelps(data.results);
      setTotal(data.total);
      setNumberOfPages(data.numberOfPages)
    }
  }, [data]);

  return [{ helps, total, numberOfPages, error, loading }, getHelps];
};

export default useHelps;
