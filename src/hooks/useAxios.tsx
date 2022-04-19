import { makeUseAxios } from "axios-hooks";
import { createAxios } from '../helpers/createAxios';

const useAxios = makeUseAxios({
  axios: createAxios()
});

export default useAxios;
