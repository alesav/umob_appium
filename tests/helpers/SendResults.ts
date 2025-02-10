// apiHelper.js
const submitTestRun = async (testId, status, details = '') => {
    try {
      const response = await fetch('https://umobqa.pages.dev/api/v1/runs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            testId,
            status,
            details
          }
        })
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