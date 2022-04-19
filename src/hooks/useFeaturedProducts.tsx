import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Options, RefetchOptions } from 'axios-hooks';
import { useEffect, useState } from 'react';
import useAxios from './useAxios';

type useFeaturedProductsParams = {
  options?: undefined | Options;
  axiosConfig?: AxiosRequestConfig | undefined;
}

type useFeaturedProductsReturnType = [
  {
    featuredProducts: any[];
    total: number;
    error: AxiosErrorType;
    loading: boolean;
    numberOfPages: number;
    size: number;
  },
  (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>
]

type AxiosErrorType = AxiosError<any> | undefined;

const useFeaturedProducts = ({ options, ...axiosConfig }: useFeaturedProductsParams = {}): useFeaturedProductsReturnType => {

  const [{ data, error, loading }, getFeaturedProducts] = useAxios({ url: '/featured-ads', ...axiosConfig }, { useCache: false, ...options });

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [size, setSize] = useState(0);

  useEffect(() => {
    if (data) {
      setFeaturedProducts(data.results);
      setTotal(data.total);
      setNumberOfPages(data.numberOfPages);
      setSize(data.size);
    }
  }, [data]);

  return [{ featuredProducts, total, size, numberOfPages, error, loading }, getFeaturedProducts];
};

export default useFeaturedProducts;
