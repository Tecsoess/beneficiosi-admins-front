import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Options, RefetchOptions } from 'axios-hooks';
import { useEffect, useState } from 'react';
import useAxios from './useAxios';


type useDiscountsTypesParams = {
  options?: undefined | Options;
  axiosConfig?: AxiosRequestConfig | undefined;
}

type useDiscountsTypesReturnType = [
  {
    discountsTypes: any[];
    total: number;
    error: AxiosErrorType;
    loading: boolean;
    numberOfPages: number;
    size: number;
  },
  (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>
]

type AxiosErrorType = AxiosError<any> | undefined;

const useDiscountsTypes = ({ options, axiosConfig }: useDiscountsTypesParams = {}): useDiscountsTypesReturnType => {

  const [{ data, error, loading }, getDiscountsTypes] = useAxios({ url: '/discounts-types', ...axiosConfig }, options);

  const [discountsTypes, setDiscountsTypes] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setDiscountsTypes(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ discountsTypes, total, numberOfPages, size, error, loading }, getDiscountsTypes];
};

export default useDiscountsTypes;
