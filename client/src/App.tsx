// React
import { useState, useEffect } from "react";

// Components
import CpuList from "./components/CpuList";
import AddCpuForm from "./components/AddForm/AddCpuForm";
import PageIndex from "./components/PageIndex";
import SearchBar from "./components/SearchBar";
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

  // Handles the initial loading state for all CPUs data
  const [cpus, setCpus] = useState<CpuType[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Controls the visibility for all tables
  const [showAll, setShowAll] = useState<boolean>(false);

  // Handles the search term within the search bar
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Controls the add form visibility
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

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
        setLoading(true);
        const response = await fetch(baseUrl);
        if (!response.ok)
          throw new Error("Failed to fetch data from the server");
        const data: CpuType[] = (await response.json()) as CpuType[];
        setCpus(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
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
      setCpus((prevCpus: CpuType[]) => [...prevCpus, returnedObject]); // Functional update for state

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
      setCpus(cpus.map((c) => (c.id === newSpecs.id ? updatedData : c)));
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
      setCpus(cpus.filter((cpu: CpuType) => cpu.id !== cpuToRemove.id));

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

  // Filter the list based on the search term
  const filteredCpus: CpuType[] = cpus.filter((cpu: CpuType) => {
    return `${cpu.manufacturer} ${cpu.model}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <header>
        <h1 id="main-page-title">CPU Manager</h1>{" "}
      </header>

      {/* Main page controls section */}
      <nav>
        <AddCpuForm
          addCpu={addCpu}
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
          requestLoading={requestLoading}
        />

        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <PageIndex cpusData={filteredCpus} />

        <div id="show-all-button" className="button-area">
          <button onClick={() => setShowAll((prev) => !prev)}>
            {showAll ? "Hide all data" : "Show all data"}
          </button>
        </div>
      </nav>

      {/* CPUs section */}
      <main>
        <section>
          <CpuList
            cpus={filteredCpus}
            updateCpu={updateCpu}
            deleteCpu={deleteCpu}
            showAll={showAll}
            scrollToIndex={scrollToIndex}
            loading={loading}
            error={error}
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
    </div>
  );
}
