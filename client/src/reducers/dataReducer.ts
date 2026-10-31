import type { DataState, DataActions } from "../types/context";

export const initialDataState: DataState = {
  cpus: [],
  cpusFound: [],
  loading: false,
  error: null,
  cpuSelected: null,
};

const dataReducer = (state: DataState, action: DataActions): DataState => {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        cpus: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "SET_FOUND":
      return {
        ...state,
        cpusFound: action.payload,
      };
    case "ADD_CPU":
      return {
        ...state,
        cpus: [...state.cpus, action.payload],
      };
    case "SELECT_CPU":
      return {
        ...state,
        cpuSelected: action.payload,
      }
    default:
      return assertNever(action);
  }
};

function assertNever(x: never): never {
  throw new Error("Unexpected action: " + String(x));
}

export default dataReducer;
