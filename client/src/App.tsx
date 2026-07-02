// React
import { useState, useEffect, useRef } from 'react';

// Components
import CpuList from './components/CpuList';
import AddCpuForm from './components/AddCpuForm';
import PageIndex from './components/PageIndex';
import SearchBar from './components/SearchBar';

// Services
import cpuService from './services/cpus';

// Styles
import './styles/App.css';


// Main App component
export default function App() {
  // Set the API server URL
  const baseUrl = '/api/cpus';

  // React states
  const [cpus, setCpus] = useState([]);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false); // Controls the visibility of all tables
  const [searchTerm, setSearchTerm] = useState("");

  const cpuFormRef = useRef();

  // Fetch the initial CPUs data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(baseUrl);
        if (!response.ok) throw new Error('Failed to fetch data from the server');
        const data = await response.json();
        setCpus(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchData();
  }, []);

  // Add a new CPU using the data from the add form
  const addCpu = (cpuObject) => {
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
      .catch (exception => {
        alert("Failed to add new CPU");
        console.error("Error adding new CPU:", exception);
      })
  };

  // Remove a CPU from the list
  const deleteCpu = (id, manufacturer, model) => {
    const confirmDeletion = window.confirm(`Remove ${manufacturer} ${model} from the list?`);

    if (confirmDeletion) {
      cpuService.remove(id)
        .then(() => {
          // Remove the CPU from the state
          setCpus(cpus.filter(cpu => cpu.id !== id));
        })
        .catch(error => {
          console.error('Error deleting CPU:', error);
        });
    }
  }
  
  // Scroll the page to the respective data table
  function scrollToIndex(cpuTableId) {
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
  const filteredCpus = cpus.filter((cpu) => {
    return `${cpu.manufacturer} ${cpu.model}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <div>
        <h1 id='main-page-title'>CPU Manager</h1> {/* Add ref to the <h1> element */}

        <AddCpuForm 
          createCpu={addCpu}
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
