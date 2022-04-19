import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Options, RefetchOptions } from 'axios-hooks';
import { useEffect, useState } from 'react';
import useAxios from './useAxios';


type useBankAccountsTypesParams = {
  options?: undefined | Options;
  axiosConfig?: AxiosRequestConfig | undefined;
}

type useBankAccountsTypesReturnType = [
  {
    bankAccountsTypes: any[];
    total: number;
    error: AxiosErrorType;
    loading: boolean;
    numberOfPages: number;
    size: number;
  },
  (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>
]

type AxiosErrorType = AxiosError<any> | undefined;

const useBankAccountsTypes = ({ options, axiosConfig }: useBankAccountsTypesParams = {}): useBankAccountsTypesReturnType => {

  const [{ data, error, loading }, getBankAccountsTypes] = useAxios({ url: '/bank-account-types', ...axiosConfig }, options);

  const [bankAccountsTypes, setBankAccountsTypes] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setBankAccountsTypes(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ bankAccountsTypes, total, numberOfPages, size, error, loading }, getBankAccountsTypes];
};

export default useBankAccountsTypes;
