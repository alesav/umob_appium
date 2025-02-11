import fs from 'fs';
import path from 'path';

const submitTestRun = async (testId, status, details = '', screenshot = null) => {
  try {
    // Create a FormData instance
    const formData = new FormData();

    // Add the JSON data as a string field
    formData.append('data', JSON.stringify({
      status,
      details
    }));

    // Add the screenshot file if provided
    if (screenshot) {
      
      // Read the file as a buffer
      const fileBuffer = fs.readFileSync(screenshot);
      
      // Get the filename from the path
      const filename = path.basename(screenshot);
      
      // Create a Blob from the buffer
      const blob = new Blob([fileBuffer], { type: 'image/png' });
      
      // Create a File object from the blob
      const file = new File([blob], filename, { type: 'image/png' });
      
      formData.append('file', file);
    }

    const response = await fetch('https://umobqa.pages.dev/api/v2/runs/' + testId, {
      method: 'POST',
      // Don't set Content-Type header - browser will set it automatically with boundary
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting test run:', error);
    throw error;
  }
}

export default submitTestRun;