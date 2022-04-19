import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Options, RefetchOptions } from 'axios-hooks';
import { useEffect, useState } from 'react';
import useAxios from './useAxios';


type useCardsTypesParams = {
  options?: undefined | Options;
  axiosConfig?: AxiosRequestConfig | undefined;
}

type useCardsTypesReturnType = [
  {
    cardsTypes: any[];
    total: number;
    error: AxiosErrorType;
    loading: boolean;
    numberOfPages: number;
    size: number;
  },
  (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>
]

type AxiosErrorType = AxiosError<any> | undefined;

const useCardsTypes = ({ options, axiosConfig }: useCardsTypesParams = {}): useCardsTypesReturnType => {

  const [{ data, error, loading }, getCardsTypes] = useAxios({ url: '/card-types', ...axiosConfig }, options);

  const [cardsTypes, setCardsTypes] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setCardsTypes(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ cardsTypes, total, numberOfPages, size, error, loading }, getCardsTypes];
};

export default useCardsTypes;
