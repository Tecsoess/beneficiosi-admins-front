import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Options, RefetchOptions } from 'axios-hooks';
import { useEffect, useState } from 'react';
import useAxios from './useAxios';


type useOrdersStatusesParams = {
  options?: undefined | Options;
  axiosConfig?: AxiosRequestConfig | undefined;
}

type useOrdersStatusesReturnType = [
  {
    ordersStatuses: any[];
    total: number;
    error: AxiosErrorType;
    loading: boolean;
    numberOfPages: number;
    size: number;
  },
  (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>
]

type AxiosErrorType = AxiosError<any> | undefined;

const useOrdersStatuses = ({ options, axiosConfig }: useOrdersStatusesParams = {}): useOrdersStatusesReturnType => {

  const [{ data, error, loading }, getOrdersStatuses] = useAxios({ url: '/order-statuses', ...axiosConfig }, options);

  const [ordersStatuses, setOrdersStatuses] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setOrdersStatuses(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ ordersStatuses, total, numberOfPages, size, error, loading }, getOrdersStatuses];
};

export default useOrdersStatuses;
