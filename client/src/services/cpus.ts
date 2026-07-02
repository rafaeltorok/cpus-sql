import axios from 'axios';

// TypeScript types
import type { CpuInputType } from '../types/types';

const baseUrl = "/api/cpus";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
};

const create = (newObject: CpuInputType) => {
  const request = axios.post(baseUrl, newObject);
  return request.then(response => response.data);
};

const update = (id: number, newObject: CpuInputType) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then(response => response.data);
};

const remove = (id: number) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then(response => response.data);
};

export default { getAll, create, update, remove };
