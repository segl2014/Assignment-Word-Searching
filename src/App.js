import React, { useState } from 'react';
import AddModal from './AddModal';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [filterActive, setFilterActive] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();

    fetch(`https://api.dev.food.delivery.tdrsoftware.in/serach/word/${searchTerm}`)
      .then(response => response.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setResults(data.data[0].words); 
        } else {
          setResults([]);
        }
        setFilterActive(false);
      })
      .catch(error => {
        console.error('Error fetching search results:', error);
      });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value === "") {
      setFilteredWords([]);
      setResults([]);
      setFilterActive(false);
    } else if (value.length >= 1) {
      setFilterActive(true);
      fetch(`https://api.dev.food.delivery.tdrsoftware.in/serach/word/${value}`)
        .then(response => response.json())
        .then(data => {
          if (data.success && data.data.length > 0) {
            const filtered = data.data[0].words.filter(word =>
              word.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredWords(filtered);
          } else {
            setFilteredWords([]);
          }
        })
        .catch(error => {
          console.error('Error fetching filtered words:', error);
        });
    } else {
      setFilterActive(false);
    }
  };

  const handleDelete = (word) => {
    fetch(`https://api.dev.food.delivery.tdrsoftware.in/delete/word/${word}`, { method: 'DELETE' })
      .then(response => {
        if (!response.ok) {
        
          return response.text().then(text => { throw new Error(text); });
        }
        return response.json(); 
      })
      .then(data => {
        if (data.success) {
          console.log("Deleted:", word);
         
          setResults(prevResults => prevResults.filter(result => result !== word));
          setFilteredWords(prevFiltered => prevFiltered.filter(filtered => filtered !== word));
        } else {
          console.error("Error deleting word");
        }
      })
      .catch(error => {
        console.error('Error deleting word:', error);
      });
  };
  

  const handleWordAdded = (newWord) => {
    setResults(prevResults => [...prevResults, newWord]);  
    setFilteredWords(prevFiltered => {
      if (searchTerm && newWord.toLowerCase().includes(searchTerm.toLowerCase())) {
        return [...prevFiltered, newWord];  
      }
      return prevFiltered;
    });
  };

  return (
    <div className="App">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand">Discretionary and Meaning</a>
          <form className="d-flex" onSubmit={handleSearch}>
            <input 
              className="form-control me-2" 
              type="search" 
              placeholder="Search" 
              aria-label="Search" 
              value={searchTerm} 
              onChange={handleInputChange} 
            />
            <button className="btn btn-outline-success me-2" type="submit">Search</button>

            {/* Add Button and Modal */}
            <AddModal onWordAdded={handleWordAdded} />
    
          </form>
        </div>
      </nav>

      {/* Container for results */}
      <div className="container mt-3">
        {filterActive ? (
          <div>
            <h5>Filtered Suggestions:</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Word</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredWords.length > 0 ? filteredWords.map((word, index) => (
                  <tr key={index}>
                    <td>{word}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(word)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="2">No suggestions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <h5>Search Results:</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Word</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {results.length > 0 ? results.map((result, index) => (
                  <tr key={index}>
                    <td>{result}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(result)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="2">No results found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
