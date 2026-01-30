# API Service Documentation

This directory contains a reusable API service structure for making HTTP requests.

## Structure

- **`api.config.js`** - API configuration (base URL, keys, timeouts)
- **`apiClient.js`** - Core API client with middleware and interceptors
- **`apiService.js`** - Reusable HTTP methods (GET, POST, PUT, DELETE, PATCH, UPLOAD)
- **`endpoints.js`** - Centralized API endpoint definitions
- **`index.js`** - Main export file

## Setup

1. Create a `.env` file in the root directory:
```env
REACT_APP_API_BASE_URL=https://api.yourdomain.com/api/v1
REACT_APP_API_KEY=your_api_key_here
REACT_APP_API_SECRET_KEY=your_api_secret_key_here
```

2. Import the API service in your components:
```javascript
import api, { API_ENDPOINTS } from '../services/api';
```

## Usage Examples

### GET Request
```javascript
// Simple GET request
const response = await api.get(API_ENDPOINTS.PATIENTS.LIST);
console.log(response.data);

// GET with query parameters
const response = await api.get(API_ENDPOINTS.PATIENTS.LIST, {
  page: 1,
  limit: 10,
  search: 'john'
});
```

### POST Request
```javascript
// Create a new patient
const newPatient = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '123-456-7890'
};

const response = await api.post(API_ENDPOINTS.PATIENTS.CREATE, newPatient);
console.log(response.data);
```

### PUT Request
```javascript
// Update a patient
const updatedData = {
  name: 'Jane Doe',
  email: 'jane@example.com'
};

const response = await api.put(
  API_ENDPOINTS.PATIENTS.UPDATE(patientId),
  updatedData
);
```

### DELETE Request
```javascript
// Delete a patient
const response = await api.delete(API_ENDPOINTS.PATIENTS.DELETE(patientId));
```

### PATCH Request
```javascript
// Partial update
const response = await api.patch(
  API_ENDPOINTS.PATIENTS.UPDATE(patientId),
  { email: 'newemail@example.com' }
);
```

### File Upload
```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('patientId', patientId);

const response = await api.upload(
  '/patients/upload',
  formData,
  (progress) => {
    console.log(`Upload progress: ${progress}%`);
  }
);
```

### With Error Handling
```javascript
try {
  const response = await api.get(API_ENDPOINTS.PATIENTS.LIST);
  console.log(response.data);
} catch (error) {
  console.error('Error:', error.message);
  // Handle error (show toast, etc.)
}
```

### Using in React Components
```javascript
import React, { useState, useEffect } from 'react';
import api, { API_ENDPOINTS } from '../services/api';

function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.PATIENTS.LIST);
      setPatients(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {patients.map(patient => (
        <div key={patient.id}>{patient.name}</div>
      ))}
    </div>
  );
}
```

## Features

- ✅ Automatic authentication token handling
- ✅ API key and secret key management
- ✅ Request/Response interceptors
- ✅ Error handling with automatic logout on 401
- ✅ Timeout handling
- ✅ Query parameter building
- ✅ File upload support with progress tracking
- ✅ TypeScript-ready structure

## Customization

### Adding Custom Interceptors

```javascript
import { apiClient } from '../services/api';

// Add request interceptor
apiClient.addRequestInterceptor((config) => {
  // Modify request config
  config.headers['Custom-Header'] = 'value';
  return config;
});

// Add response interceptor
apiClient.addResponseInterceptor((response) => {
  // Process response
  console.log('Response received:', response);
  return response;
});
```

### Updating Endpoints

Edit `endpoints.js` to add or modify API endpoints:

```javascript
const API_ENDPOINTS = {
  // Your endpoints here
  CUSTOM: {
    LIST: '/custom',
    CREATE: '/custom',
    GET_BY_ID: (id) => `/custom/${id}`,
  },
};
```

