import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function AddModal({ onWordAdded }) {
  const [show, setShow] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    setShow(false);
    setNewWord("");
    setErrorMessage("");
  };
  const handleShow = () => setShow(true);

  const handleSave = () => {
    if (newWord.trim() === "") {
      setErrorMessage("Please enter a word.");
      return;
    }
  
    // Sending the word in an array as 'words'
    fetch('https://api.dev.food.delivery.tdrsoftware.in/add/word', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ words: [newWord] }), // Corrected key to 'words'
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);
  
        if (data.success) {
          onWordAdded(newWord);  
          handleClose();  
        } else {
          setErrorMessage(`Failed to add the word: ${data.message || "Unknown error"}`);
        }
      })
      .catch((error) => {
        console.error('Error adding word:', error);
        setErrorMessage(`An error occurred while adding the word: ${error.message}`);
      });
  };
  
  
  return (
    <>
      <Button variant="outline-success" className="me-2" onClick={handleShow}>
        Add
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Word</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Word</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter a word" 
              value={newWord} 
              onChange={(e) => setNewWord(e.target.value)} 
            />
          </Form.Group>
          {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddModal;
