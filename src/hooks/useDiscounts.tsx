import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Options, RefetchOptions } from 'axios-hooks';
import { useEffect, useState } from 'react';
import useAxios from './useAxios';


type useDiscountsParams = {
  options?: undefined | Options;
  axiosConfig?: AxiosRequestConfig | undefined;
}

type useDiscountsReturnType = [
  {
    discounts: any[];
    total: number;
    error: AxiosErrorType;
    loading: boolean;
    numberOfPages: number;
    size: number;
  },
  (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>
]

type AxiosErrorType = AxiosError<any> | undefined;

const useDiscounts = ({ options, axiosConfig }: useDiscountsParams = {}): useDiscountsReturnType => {

  const [{ data, error, loading }, getDiscounts] = useAxios({ url: '/discounts', ...axiosConfig }, options);

  const [discounts, setDiscounts] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setDiscounts(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ discounts, total, numberOfPages, size, error, loading }, getDiscounts];
};

export default useDiscounts;
