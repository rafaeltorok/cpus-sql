import axios from 'axios';

// TypeScript types
import type { NewCpu, CpuType } from '../types/types';

const baseUrl = "/api/cpus";

const getAll = async () => {
  const response = await axios.get<CpuType[]>(baseUrl);
  return response.data;
};

const create = async (newObject: NewCpu) => {
  const response = await axios.post<CpuType>(baseUrl, newObject);
  return response.data;
};

const update = async (id: number, newObject: NewCpu) => {
  const response = await axios.put<CpuType>(`${baseUrl}/${id}`, newObject);
  return response.data;
};

const remove = async (id: number) => {
  await axios.delete(`${baseUrl}/${id}`);
  return;
};

export default { getAll, create, update, remove };
