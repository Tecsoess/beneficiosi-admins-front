import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Options, RefetchOptions } from 'axios-hooks';
import { useEffect, useState } from 'react';
import useAxios from './useAxios';


type useCardsParams = {
  options?: undefined | Options;
  axiosConfig?: AxiosRequestConfig | undefined;
}

type useCardsReturnType = [
  {
    cards: any[];
    total: number;
    error: AxiosErrorType;
    loading: boolean;
    numberOfPages: number;
    size: number;
  },
  (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>
]

type AxiosErrorType = AxiosError<any> | undefined;

const useCards = ({ options, axiosConfig }: useCardsParams = {}): useCardsReturnType => {

  const [{ data, error, loading }, getCards] = useAxios({ url: '/cards', ...axiosConfig }, options);

  const [cards, setCards] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setCards(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ cards, total, numberOfPages, size, error, loading }, getCards];
};

export default useCards;
