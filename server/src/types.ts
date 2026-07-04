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
}

export interface CpuType extends NewCpu {
  id: number;
}
