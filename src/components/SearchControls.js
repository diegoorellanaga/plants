import { useState, useEffect } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import React from 'react';

function SearchControls({ onSearch }) {
  const [inputValue, setInputValue] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(inputValue);
    }, 500); // 300ms delay
    
    return () => clearTimeout(timer);
  }, [inputValue, onSearch]);




  return (
    <InputGroup className="mb-3">
      <Form.Control
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search plants..."
        aria-label="Plant search"
      />
      <InputGroup.Text>
        <i className="bi bi-search"></i>
      </InputGroup.Text>
    </InputGroup>
  );
}

export default SearchControls;  // Fixed export syntax