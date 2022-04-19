import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Options, RefetchOptions } from 'axios-hooks';
import { useEffect, useState } from 'react';
import useAxios from './useAxios';

type useLocationsParams = {
  options?: undefined | Options;
  axiosConfig?: AxiosRequestConfig | undefined;
}

type useLocationReturnType = [
  {
    locations: any[];
    total: number;
    error: AxiosErrorType;
    loading: boolean;
    size: number;
    numberOfPages: number;
  },
  (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>
]

type AxiosErrorType = AxiosError<any> | undefined;


const useLocations = ({ options, ...axiosConfig }: useLocationsParams = {}): useLocationReturnType => {

  const [{ data, error, loading }, getLocations] = useAxios({ url: '/locations', ...axiosConfig }, { useCache: false, ...options });

  const [locations, setLocations] = useState([]);
  const [total, setTotal] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [size, setSize] = useState(0);

  useEffect(() => {
    if (data) {
      setLocations(data.results);
      setTotal(data.total);
      setNumberOfPages(data.numberOfPages);
      setSize(data.size);
    }
  }, [data]);

  return [{ locations, size, total, numberOfPages, error, loading }, getLocations];
};

export default useLocations;
