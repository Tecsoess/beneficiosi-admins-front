import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Options, RefetchOptions } from 'axios-hooks';
import { useEffect, useState } from 'react';
import useAxios from './useAxios';


type useAdsPositionsParams = {
  options?: undefined | Options;
  axiosConfig?: AxiosRequestConfig | undefined;
}

type useAdsPositionsReturnType = [
  {
    adsPositions: any[];
    total: number;
    error: AxiosErrorType;
    loading: boolean;
    numberOfPages: number;
    size: number;
  },
  (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>
]

type AxiosErrorType = AxiosError<any> | undefined;

const useAdsPositions = ({ options, axiosConfig }: useAdsPositionsParams = {}): useAdsPositionsReturnType => {

  const [{ data, error, loading }, getAdsPositions] = useAxios({ url: '/ads-positions', ...axiosConfig }, options);

  const [adsPositions, setAdsPositions] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setAdsPositions(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ adsPositions, total, numberOfPages, size, error, loading }, getAdsPositions];
};

export default useAdsPositions;
