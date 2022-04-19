import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Options, RefetchOptions } from 'axios-hooks';
import { useEffect, useState } from 'react';
import useAxios from './useAxios';


type useFeatureStoresParams = {
  options?: undefined | Options;
  axiosConfig?: AxiosRequestConfig | undefined;
}

type useFeatureStoresReturnType = [
  {
    featureStores: any[];
    total: number;
    error: AxiosErrorType;
    loading: boolean;
    numberOfPages: number;
    size: number;
  },
  (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>
]

type AxiosErrorType = AxiosError<any> | undefined;

const useFeatureStores = ({ options, axiosConfig }: useFeatureStoresParams = {}): useFeatureStoresReturnType => {

  const [{ data, error, loading }, getFeatureStores] = useAxios({ url: '/store-features', ...axiosConfig }, options);

  const [featureStores, setFeatureStores] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setFeatureStores(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ featureStores, total, numberOfPages, size, error, loading }, getFeatureStores];
};

export default useFeatureStores;
