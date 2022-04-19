import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Options, RefetchOptions } from 'axios-hooks';
import { useEffect, useState } from 'react';
import useAxios from './useAxios';


type useCardsIssuersParams = {
  options?: undefined | Options;
  axiosConfig?: AxiosRequestConfig | undefined;
}

type useCardsIssuersReturnType = [
  {
    cardsIssuers: any[];
    total: number;
    error: AxiosErrorType;
    loading: boolean;
    numberOfPages: number;
    size: number;
  },
  (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>
]

type AxiosErrorType = AxiosError<any> | undefined;

const useCardsIssuers = ({ options, axiosConfig }: useCardsIssuersParams = {}): useCardsIssuersReturnType => {

  const [{ data, error, loading }, getCardsIssuers] = useAxios({ url: '/card-issuers', ...axiosConfig }, options);

  const [cardsIssuers, setCardsIssuers] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setCardsIssuers(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ cardsIssuers, total, numberOfPages, size, error, loading }, getCardsIssuers];
};

export default useCardsIssuers;
