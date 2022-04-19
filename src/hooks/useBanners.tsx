import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Options, RefetchOptions } from 'axios-hooks';
import { useEffect, useState } from 'react';
import useAxios from './useAxios';

type useBannersParams = {
  options?: undefined | Options;
  axiosConfig?: AxiosRequestConfig | undefined;
}

type useBannersReturnType = [
  {
    banners: any[];
    total: number;
    error: AxiosErrorType;
    loading: boolean;
    numberOfPages: number;
    size: number;
  },
  (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>
]

type AxiosErrorType = AxiosError<any> | undefined;

const useBanners = ({ options, ...axiosConfig }: useBannersParams = {}): useBannersReturnType => {

  const [{ data, error, loading }, getBanners] = useAxios({ url: '/main-banner-ads', ...axiosConfig }, options);

  const [banners, setBanners] = useState([]);
  const [total, setTotal] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [size, setSize] = useState(0);

  useEffect(() => {
    if (data) {
      setBanners(data.results);
      setTotal(data.total);
      setNumberOfPages(data.numberOfPages);
      setSize(data.size);
    }
  }, [data]);

  return [{ banners, size, total, numberOfPages, error, loading }, getBanners];
};

export default useBanners;
