import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Options, RefetchOptions } from 'axios-hooks';
import { useEffect, useState } from 'react';
import useAxios from './useAxios';


type useBankAccountsPurposeParams = {
  options?: undefined | Options;
  axiosConfig?: AxiosRequestConfig | undefined;
}

type useBankAccountsPurposeReturnType = [
  {
    bankAccountsPurpose: any[];
    total: number;
    error: AxiosErrorType;
    loading: boolean;
    numberOfPages: number;
    size: number;
  },
  (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>
]

type AxiosErrorType = AxiosError<any> | undefined;

const useBankAccountsPurpose = ({ options, axiosConfig }: useBankAccountsPurposeParams = {}): useBankAccountsPurposeReturnType => {

  const [{ data, error, loading }, getBankAccountsPurpose] = useAxios({ url: '/bank-account-purposes', ...axiosConfig }, options);

  const [bankAccountsPurpose, setBankAccountsPurpose] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setBankAccountsPurpose(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ bankAccountsPurpose, total, numberOfPages, size, error, loading }, getBankAccountsPurpose];
};

export default useBankAccountsPurpose;
