import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Options, RefetchOptions } from 'axios-hooks';
import { useEffect, useState } from 'react';
import useAxios from './useAxios';

type useHelpsCategoriesParams = {
  options?: undefined | Options;
  axiosConfig?: AxiosRequestConfig | undefined;
}

type useHelpsCategoriesReturnType = [
  {
    helpsCategories: any[];
    total: number;
    error: AxiosErrorType;
    loading: boolean;
    numberOfPages: number;
  },
  (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>
]

type AxiosErrorType = AxiosError<any> | undefined;

const useHelpsCategories = ({ options, ...axiosConfig }: useHelpsCategoriesParams = {}): useHelpsCategoriesReturnType => {

  const [{ data, error, loading }, getHelpsCategories] = useAxios({ url: '/help-categories', ...axiosConfig }, { useCache: false, ...options });

  const [helpsCategories, setHelpsCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setHelpsCategories(data.results);
      setTotal(data.total);
      setNumberOfPages(data.numberOfPages)
    }
  }, [data]);

  return [{ helpsCategories, total, numberOfPages, error, loading }, getHelpsCategories];
};

export default useHelpsCategories;
