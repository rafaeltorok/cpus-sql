// React
import { useState, useEffect, useReducer } from "react";

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

  // Displays a popup dialog loading message when sending API requests
  const [requestLoading, setRequestLoading] = useState<boolean>(false);

  // Handles displaying a notification message with a close button
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  // Displays a dialog message to confirm a CPU removal
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);

  // Fetch the initial CPUs data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setRequestLoading(true);
        setMessage("Loading CPUs data, please wait...");
        
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
        setRequestLoading(false);
      }
    };
    void fetchData();
  }, []);

  // Add a new CPU using the data from the add form
  async function addCpu(cpuObject: NewCpu): Promise<boolean> {
    try {
      setMessage("Submitting data, please wait...");
      setRequestLoading(true);

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
        setMessage("Invalid CPU data");
        setRequestLoading(false);
        setShowNotification(true);
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
      setMessage(
        `${returnedObject.manufacturer} ${returnedObject.model} was added!`,
      );
      setRequestLoading(false);
      setShowNotification(true);

      return true;
    } catch (_err: unknown) {
      setMessage("Failed to add new CPU");
      setRequestLoading(false);
      setShowNotification(true);
      return false;
    }
  }

  // Update a CPU specifications
  async function updateCpu(newSpecs: CpuType): Promise<boolean> {
    try {
      setMessage("Updating specs, please wait...");
      setRequestLoading(true);

      // Send an API request to update the specs
      const updatedData = await cpuService.update(newSpecs.id, newSpecs);

      // Update the current CPU list with the updated returned object
      dataDispatch({
        type: "FETCH_SUCCESS",
        payload: dataState.cpus.map((c: CpuType) => c.id === updatedData.id ? updatedData : c),
      });

      setRequestLoading(false);
      return true;
    } catch (_exception) {
      setRequestLoading(false);
      setMessage("Failed to update the CPU specs");
      setShowNotification(true);
      return false;
    }
  }

  // Remove a CPU from the list
  async function deleteCpu(cpuToRemove: CpuType) {
    try {
      setMessage("Removing CPU from the database, please wait...");
      setRequestLoading(true);

      await cpuService.remove(cpuToRemove.id);

      // Remove the CPU from the current list
      dataDispatch({
        type: "FETCH_SUCCESS",
        payload: dataState.cpus.filter((c: CpuType) => c.id !== cpuToRemove.id),
      });

      setRequestLoading(false);
      setMessage(
        `${cpuToRemove.manufacturer} ${cpuToRemove.model} was removed`,
      );
      setShowNotification(true);
      return true;
    } catch (_exception) {
      setRequestLoading(false);
      setMessage(
        `Failed to remove ${cpuToRemove.manufacturer} ${cpuToRemove.model}`,
      );
      setShowNotification(true);
      return false;
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
        <AddCpuForm
          requestLoading={requestLoading}
        />

        <SearchBar />

        <PageIndex />

        <ShowAllButton />
      </nav>

      {/* CPUs section */}
      <main>
        <section>
          <CpuList
            scrollToIndex={scrollToIndex}
            requestLoading={requestLoading}
            showConfirmDialog={showConfirmDialog}
            setShowConfirmDialog={setShowConfirmDialog}
          />
        </section>
      </main>

      {/* Dialog messages */}
      <LoadingMessage showMessage={requestLoading} message={message} />
      <NotificationMessage
        showMessage={showNotification}
        setShowMessage={setShowNotification}
        message={message}
      />
    </CpuContext.Provider>
  );
}
