// React
import { useState, useEffect, useRef } from 'react';

// Components
import CpuList from './components/CpuList';
import AddCpuForm from './components/AddCpuForm';
import PageIndex from './components/PageIndex';
import SearchBar from './components/SearchBar';

// Services
import cpuService from './services/cpus';

// TypeScript types
import type { CpuType, CpuInputType } from './types/types';

// Styles
import './styles/App.css';


// Main App component
export default function App() {
  // Set the API server URL
  const baseUrl = '/api/cpus';

  // React states
  const [cpus, setCpus] = useState<CpuType[]>([]);
  const [error, setError] = useState<string>("");
  const [showAll, setShowAll] = useState<boolean>(false); // Controls the visibility of all tables
  const [searchTerm, setSearchTerm] = useState<string>("");

  const cpuFormRef = useRef();

  // Fetch the initial CPUs data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(baseUrl);
        if (!response.ok) throw new Error('Failed to fetch data from the server');
        const data: CpuType[] = await response.json();
        setCpus(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      }
    }
    fetchData();
  }, []);

  // Add a new CPU using the data from the add form
  const addCpu = (cpuObject: CpuInputType): void => {
    if (
        cpuObject.manufacturer === '' ||
        cpuObject.model === '' ||
        cpuObject.cores < 1 ||
        cpuObject.threads < 1 ||
        cpuObject.cache < 0.01 ||
        cpuObject.baseclock < 0.1 ||
        cpuObject.boostclock < 0.1 ||
        cpuObject.architecture === '' ||
        cpuObject.mbsocket === ''
      ) {
      alert("Invalid CPU data");
      return;
    }

    cpuService
      .create(cpuObject)
      .then(returnedObject => {
        setCpus((prevCpus) => [...prevCpus, returnedObject]); // Functional update for state
        console.log("CPU Specs Submitted:", returnedObject);
        alert(`${returnedObject.manufacturer} ${returnedObject.model} was added!`);
        cpuFormRef.current.toggleVisibility();
      })
      .catch (_exception => {
        alert("Failed to add new CPU");
      })
  };

  // Remove a CPU from the list
  const deleteCpu = (id: number, manufacturer: string, model: string) => {
    const confirmDeletion = window.confirm(`Remove ${manufacturer} ${model} from the list?`);

    if (confirmDeletion) {
      cpuService.remove(id)
        .then(() => {
          // Remove the CPU from the state
          setCpus(cpus.filter(cpu => cpu.id !== id));
        })
        .catch(_exception => {
          alert("Failed to remove CPU");
        });
    }
  }
  
  // Scroll the page to the respective data table
  function scrollToIndex(cpuTableId: string): void {
    const element = document.getElementById('page-index-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });

      const cpuTable = document.getElementById(cpuTableId);
      const hideButton = cpuTable.querySelector('.show-hide-button');
      const showAllButton = document.getElementById('show-all-button');
      
      if (
        hideButton && 
        hideButton.textContent === 'Hide' && 
        showAllButton.textContent === 'Show all data'
      ) {
        hideButton.click();
      }
    }
  }

  // Filter the list based on the search term
  const filteredCpus: CpuType[] = cpus.filter((cpu) => {
    return `${cpu.manufacturer} ${cpu.model}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <div>
        <h1 id='main-page-title'>CPU Manager</h1> {/* Add ref to the <h1> element */}

        <AddCpuForm 
          addCpu={addCpu}
          ref={cpuFormRef}
        />

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        
        <PageIndex
          cpusData={filteredCpus}
        />
        
        <div 
          id='show-all-button'
          className='button-area'
        >
          <button
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Hide all data" : "Show all data"}
          </button>
        </div>
        
        {error && <p>Error: {error}</p>}
        
        {filteredCpus.length === 0 ? (
          <h2>No CPUs were found</h2>
        ) : (
          <CpuList
            cpus={filteredCpus}
            deleteCpu={deleteCpu}
            showAll={showAll}
            scrollToIndex={scrollToIndex}
          />
        )}
      </div>
    </>
  )
}
