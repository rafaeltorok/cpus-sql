// React
import { useEffect, useReducer } from "react";

// React context
import CpuContext from "./context/cpuContext";
import dataReducer, { initialDataState} from "./reducers/dataReducer";
import uiReducer, { initialUiState } from "./reducers/uiReducer";

// Components
import CpuList from "./components/CpuList";
import AddCpuForm from "./components/AddForm/AddCpuForm";
import PageIndex from "./components/PageIndex";
import SearchBar from "./components/SearchBar";
import ShowAllButton from "./components/ShowAllButton";
import LoadingMessage from "./components/DialogMessages/LoadingMessage";
import NotificationMessage from "./components/DialogMessages/NotificationMessage";
import ConfirmMessage from "./components/DialogMessages/ConfirmMessage";

// Services
import cpuService from "./services/cpus";

// TypeScript types
import type { CpuType, NewCpu } from "./types/types";

// Styles
import "./styles/App.css";

// Main App component
export default function App() {
  // Set the API server URL
  const baseUrl = "/api/cpus";

  // Context reducers
  const [dataState, dataDispatch] = useReducer(dataReducer, initialDataState);
  const [uiState, uiDispatch] = useReducer(uiReducer, initialUiState);

  // Fetch the initial CPUs data
  useEffect(() => {
    const fetchData = async () => {
      try {
        uiDispatch({ type: "TOGGLE_LOADING_MESSAGE", payload: true });
        uiDispatch({ type: "SET_DIALOG_MESSAGE", payload: "Loading CPUs data, please wait..." });
        
        dataDispatch({ type: "FETCH_START" });
        const response = await fetch(baseUrl);
        const data: CpuType[] = (await response.json()) as CpuType[];
        dataDispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err: unknown) {
         if (err instanceof Error) {
          dataDispatch({ type: "FETCH_FAILURE", payload: err.message });
        } else {
          dataDispatch({ type: "FETCH_FAILURE", payload: String(err) });
        }
      } finally {
        uiDispatch({ type: "TOGGLE_LOADING_MESSAGE", payload: false });
      }
    };
    void fetchData();
  }, []);

  // Add a new CPU using the data from the add form
  async function addCpu(cpuObject: NewCpu): Promise<boolean> {
    try {
      uiDispatch({ type: "SET_DIALOG_MESSAGE", payload: "Submitting data, please wait..." });
      uiDispatch({ type: "TOGGLE_LOADING_MESSAGE", payload: true });

      // Check if the data is valid before sending it to the server
      if (
        cpuObject.manufacturer === "" ||
        cpuObject.model === "" ||
        cpuObject.cores < 1 ||
        cpuObject.threads < 1 ||
        cpuObject.cache < 0.1 ||
        cpuObject.baseclock < 0.1 ||
        cpuObject.boostclock < 0.1 ||
        cpuObject.architecture === "" ||
        cpuObject.mbsocket === ""
      ) {
        uiDispatch({ type: "SET_DIALOG_MESSAGE", payload: "Invalid CPU data" });
        uiDispatch({ type: "TOGGLE_LOADING_MESSAGE", payload: false });
        uiDispatch({ type: "TOGGLE_NOTIFICATION_MESSAGE", payload: true });
        return false;
      }

      // Create a new object through the axios route
      const returnedObject = await cpuService.create(cpuObject);

      // Update the Web UI to contain the new object
      dataDispatch({
        type: "ADD_CPU",
        payload: returnedObject,
      });

      // Show a confirmation message on success
      uiDispatch({ type: "SET_DIALOG_MESSAGE", payload: `${returnedObject.manufacturer} ${returnedObject.model} was added!` });
      uiDispatch({ type: "TOGGLE_LOADING_MESSAGE", payload: false });
      uiDispatch({ type: "TOGGLE_NOTIFICATION_MESSAGE", payload: true });

      return true;
    } catch (_err: unknown) {
      uiDispatch({ type: "SET_DIALOG_MESSAGE", payload: "Failed to add new CPU" });
      uiDispatch({ type: "TOGGLE_LOADING_MESSAGE", payload: false });
      uiDispatch({ type: "TOGGLE_NOTIFICATION_MESSAGE", payload: true });
      return false;
    }
  }

  // Update a CPU specifications
  async function updateCpu(newSpecs: CpuType): Promise<boolean> {
    try {
      uiDispatch({ type: "SET_DIALOG_MESSAGE", payload: "Updating specs, please wait..." });
      uiDispatch({ type: "TOGGLE_LOADING_MESSAGE", payload: true });

      // Send an API request to update the specs
      const updatedData = await cpuService.update(newSpecs.id, newSpecs);

      // Update the current CPU list with the updated returned object
      dataDispatch({
        type: "FETCH_SUCCESS",
        payload: dataState.cpus.map((c: CpuType) => c.id === updatedData.id ? updatedData : c),
      });

      uiDispatch({ type: "TOGGLE_LOADING_MESSAGE", payload: false });
      return true;
    } catch (_exception) {
      uiDispatch({ type: "TOGGLE_LOADING_MESSAGE", payload: false });
      uiDispatch({ type: "SET_DIALOG_MESSAGE", payload: "Failed to update the CPU specs" });
      uiDispatch({ type: "TOGGLE_NOTIFICATION_MESSAGE", payload: true });
      return false;
    }
  }

  // Remove a CPU from the list
  async function deleteCpu() {
    const cpuToRemove = dataState.cpuSelected;

    try {
      if (cpuToRemove) {
        uiDispatch({ type: "SET_DIALOG_MESSAGE", payload: "Removing CPU from the database, please wait..." });
        uiDispatch({ type: "TOGGLE_LOADING_MESSAGE", payload: true });

        await cpuService.remove(cpuToRemove.id);

        // Remove the CPU from the current list
        dataDispatch({
          type: "FETCH_SUCCESS",
          payload: dataState.cpus.filter((c: CpuType) => c.id !== cpuToRemove.id),
        });

        uiDispatch({ type: "TOGGLE_LOADING_MESSAGE", payload: false });
        uiDispatch({ type: "SET_DIALOG_MESSAGE", payload: `${cpuToRemove.manufacturer} ${cpuToRemove.model} was removed` });
        uiDispatch({ type: "TOGGLE_NOTIFICATION_MESSAGE", payload: true });
      }
    } catch (_exception) {
      uiDispatch({ type: "TOGGLE_LOADING_MESSAGE", payload: false });
      uiDispatch({ type: "SET_DIALOG_MESSAGE", payload: `Failed to remove ${cpuToRemove?.manufacturer} ${cpuToRemove?.model}` });
      uiDispatch({ type: "TOGGLE_NOTIFICATION_MESSAGE", payload: true });
    }
  }

  // Scroll the page to the respective data table
  function scrollToIndex(cpuTableId: string): void {
    const element = document.getElementById("page-index-container");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });

      const cpuTable = document.getElementById(cpuTableId);
      const showAllButton = document.getElementById(
        "show-all-button",
      ) as HTMLButtonElement;
      let hideButton;

      if (cpuTable) {
        hideButton = cpuTable.querySelector(
          ".show-hide-button",
        ) as HTMLButtonElement;
      }

      if (
        hideButton &&
        hideButton.textContent === "Hide" &&
        showAllButton.textContent === "Show all data"
      ) {
        hideButton.click();
      }
    }
  }

  return (
    <CpuContext.Provider
      value={{
        addCpu,
        updateCpu,
        deleteCpu,
        dataState,
        dataDispatch,
        uiState,
        uiDispatch,
      }}
    >
      <header>
        <h1 id="main-page-title">CPU Manager</h1>{" "}
      </header>

      {/* Main page controls section */}
      <nav>
        <AddCpuForm />

        <SearchBar />

        <PageIndex />

        <ShowAllButton />
      </nav>

      {/* CPUs section */}
      <main>
        <section>
          <CpuList
            scrollToIndex={scrollToIndex}
          />
        </section>
      </main>

      {/* Dialog messages */}
      <LoadingMessage />
      <NotificationMessage />
      <ConfirmMessage />
    </CpuContext.Provider>
  );
}
