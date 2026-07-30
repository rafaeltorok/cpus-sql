export interface InputData {
  manufacturer: string;
  model: string;
  cores: string;
  threads: string;
  cache: string;
  baseclock: string;
  boostclock: string;
  architecture: string;
  mbsocket: string;
  tdp: string;
}

export interface NewCpu {
  manufacturer: string;
  model: string;
  cores: number;
  threads: number;
  cache: number;
  baseclock: number;
  boostclock: number;
  architecture: string;
  mbsocket: string;
  tdp: number;
}

export interface CpuType extends NewCpu {
  id: number;
}
