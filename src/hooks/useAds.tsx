import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Options, RefetchOptions } from 'axios-hooks';
import { useEffect, useState } from 'react';
import useAxios from './useAxios';


type useAdsParams = {
  options?: undefined | Options;
  axiosConfig?: AxiosRequestConfig | undefined;
}

type useAdsReturnType = [
  {
    ads: any[];
    total: number;
    error: AxiosErrorType;
    loading: boolean;
    numberOfPages: number;
    size: number;
  },
  (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>
]

type AxiosErrorType = AxiosError<any> | undefined;

const useAds = ({ options, axiosConfig }: useAdsParams = {}): useAdsReturnType => {

  const [{ data, error, loading }, getAds] = useAxios({ url: '/ads', ...axiosConfig }, options);

  const [ads, setAds] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setAds(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ ads, total, numberOfPages, size, error, loading }, getAds];
};

export default useAds;
