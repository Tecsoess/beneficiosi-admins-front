import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Options, RefetchOptions } from 'axios-hooks';
import { useEffect, useState } from 'react';
import useAxios from './useAxios';


type usePaymentMethodsParams = {
  options?: undefined | Options;
  axiosConfig?: AxiosRequestConfig | undefined;
}

type usePaymentMethodsReturnType = [
  {
    paymentMethods: any[];
    total: number;
    error: AxiosErrorType;
    loading: boolean;
    numberOfPages: number;
    size: number;
  },
  (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>
]

type AxiosErrorType = AxiosError<any> | undefined;

const usePaymentMethods = ({ options, axiosConfig }: usePaymentMethodsParams = {}): usePaymentMethodsReturnType => {

  const [{ data, error, loading }, getPaymentMethods] = useAxios({ url: '/payment-methods', ...axiosConfig }, options);

  const [paymentMethods, setPaymentMethods] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setPaymentMethods(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ paymentMethods, total, numberOfPages, size, error, loading }, getPaymentMethods];
};

export default usePaymentMethods;
