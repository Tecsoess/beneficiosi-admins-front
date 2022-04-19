import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Options, RefetchOptions } from 'axios-hooks';
import { useEffect, useState } from 'react';
import useAxios from './useAxios';

type useCategoriesParams = {
  options?: undefined | Options;
  axiosConfig?: AxiosRequestConfig | undefined;
}

type useCategoriesReturnType = [
  {
    categories: any[];
    error: AxiosErrorType;
    loading: boolean;
  },
  (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>
]

type AxiosErrorType = AxiosError<any> | undefined;

const useCategories = ({ options, ...axiosConfig }: useCategoriesParams = {}): useCategoriesReturnType => {

  const [{ data, error, loading }, getCategories] = useAxios({ url: '/store-categories', ...axiosConfig }, { useCache: false, ...options });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (data) {
      setCategories(data.results);
    }
  }, [data]);

  return [{ categories, error, loading }, getCategories];
};

export default useCategories;
