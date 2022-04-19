import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Options, RefetchOptions } from 'axios-hooks';
import { useEffect, useState } from 'react';
import useAxios from './useAxios';


type useCardsIssuersTypesParams = {
  options?: undefined | Options;
  axiosConfig?: AxiosRequestConfig | undefined;
}

type useCardsIssuersTypesReturnType = [
  {
    cardsIssuersTypes: any[];
    total: number;
    error: AxiosErrorType;
    loading: boolean;
    numberOfPages: number;
    size: number;
  },
  (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>
]

type AxiosErrorType = AxiosError<any> | undefined;

const useCardsIssuersTypes = ({ options, axiosConfig }: useCardsIssuersTypesParams = {}): useCardsIssuersTypesReturnType => {

  const [{ data, error, loading }, getCardsIssuersTypes] = useAxios({ url: '/card-issuer-types', ...axiosConfig }, options);

  const [cardsIssuersTypes, setCardsIssuersTypes] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setCardsIssuersTypes(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ cardsIssuersTypes, total, numberOfPages, size, error, loading }, getCardsIssuersTypes];
};

export default useCardsIssuersTypes;
