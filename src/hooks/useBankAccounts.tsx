import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Options, RefetchOptions } from 'axios-hooks';
import { useEffect, useState } from 'react';
import useAxios from './useAxios';


type useBankAccountsParams = {
  options?: undefined | Options;
  axiosConfig?: AxiosRequestConfig | undefined;
}

type useBankAccountsReturnType = [
  {
    bankAccounts: any[];
    total: number;
    error: AxiosErrorType;
    loading: boolean;
    numberOfPages: number;
    size: number;
  },
  (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>
]

type AxiosErrorType = AxiosError<any> | undefined;

const useBankAccounts = ({ options, axiosConfig }: useBankAccountsParams = {}): useBankAccountsReturnType => {

  const [{ data, error, loading }, getBankAccounts] = useAxios({ url: '/bank-accounts', ...axiosConfig }, options);

  const [bankAccounts, setBankAccounts] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setBankAccounts(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ bankAccounts, total, numberOfPages, size, error, loading }, getBankAccounts];
};

export default useBankAccounts;
