type CpuType = {
  id?: number;
  manufacturer: string;
  model: string;
  cores: number;
  threads: number;
  cache: number;
  baseclock: number;
  boostclock: number;
  architecture: string;
  mbsocket: string;
};

declare global {
  namespace Express {
    export interface Request {
      cpu: CpuType;
      id?: number;
    }
  }
}
