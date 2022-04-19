import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Options, RefetchOptions } from 'axios-hooks';
import { useEffect, useState } from 'react';
import useAxios from './useAxios';


type useStoreAdsParams = {
  options?: undefined | Options;
  axiosConfig?: AxiosRequestConfig | undefined;
}

type useStoreAdsReturnType = [
  {
    storeAds: any[];
    total: number;
    error: AxiosErrorType;
    loading: boolean;
    numberOfPages: number;
    size: number;
  },
  (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>
]

type AxiosErrorType = AxiosError<any> | undefined;

const useStoreAds = ({ options, axiosConfig }: useStoreAdsParams = {}): useStoreAdsReturnType => {
  const [{ data, error, loading }, getStoreAds] = useAxios({ url: '/store-ads', ...axiosConfig }, options);

  const [storeAds, setStoreAds] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setStoreAds(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ storeAds, total, numberOfPages, size, error, loading }, getStoreAds];
};

export default useStoreAds;
