import type { CpuType } from "../../../types/types.ts";

const processors: CpuType[] = [
  {
    manufacturer: "AMD",
    model: "Ryzen 5 5600X",
    cores: 6,
    threads: 12,
    cache: 35,
    baseclock: 3.7,
    boostclock: 4.65,
    architecture: "Zen 3",
    mbsocket: "AM4",
  },
  {
    manufacturer: "AMD",
    model: "Ryzen 7 9800X3D",
    cores: 8,
    threads: 16,
    cache: 104,
    baseclock: 4.7,
    boostclock: 5.2,
    architecture: "Zen 5",
    mbsocket: "AM5"
  },
  {
    manufacturer: "AMD",
    model: "Ryzen 7 7800X3D",
    cores: 8,
    threads: 16,
    cache: 104,
    baseclock: 4.2,
    boostclock: 5,
    architecture: "Zen 4",
    mbsocket: "AM5"
  },
  {
    manufacturer: "Intel",
    model: "Core i7-4770K",
    cores: 4,
    threads: 8,
    cache: 9,
    baseclock: 3.5,
    boostclock: 3.9,
    architecture: "Haswell",
    mbsocket: "1150"
  },
  {
    manufacturer: "Intel",
    model: "Core i7-6700K",
    cores: 4,
    threads: 8,
    cache: 9,
    baseclock: 4,
    boostclock: 4.2,
    architecture: "Skylake",
    mbsocket: "1151"
  },
  {
    manufacturer: "Intel",
    model: "Core i7-10700K",
    cores: 8,
    threads: 16,
    cache: 18,
    baseclock: 3.8,
    boostclock: 5.1,
    architecture: "Comet Lake",
    mbsocket: "1200"
  },
];

export default processors;
