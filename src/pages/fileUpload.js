export const createLogNote = async (apiUrl, apiKey, formData) => {
    console.log(formData);
    try {
      const response = await fetch(`${apiUrl}log-note/add`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-API-Key': apiKey,
        },
      });
  
    
  
      const data = await response.json();
      console.log(data)
      return data;
    } catch (error) {
      console.error('Error creating log note:', error);
      return { success: false, message: 'Error creating log note' };
    }
  };