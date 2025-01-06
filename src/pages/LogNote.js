import React, {useState, useEffect } from "react";
import { API_NEW_URL, X_API_Key, DOC_URL } from "../config";



const InternalNote = ({ type, DataId }) => {
  const UseDetails = localStorage.getItem("userDetailKey");
  const [UserID, setUserID] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [LogHistory, setLogHistory] = useState(false);

  useEffect(()=>{
    if(UseDetails){
        const newUseDetails = JSON.parse((UseDetails))
        setUserID(newUseDetails._id)
    }
  }, [UseDetails])

  useEffect(()=>{
    if(DataId){
      GetLogNote(DataId)
    }
  }, [DataId])

    const [description, setDescription] = useState('');
    const typeNew = type
  



    const handleSubmit = async (e) => {
      e.preventDefault();
      if(!DataId){
        if(typeNew === "Receipt"){
          alert('You need to create a receipt before adding a log.')
          return;
        }
        if(typeNew === "Delivery"){
          alert('You need to create a delivery before adding a log.')
          return;
        }
      }

      const formData = new FormData();
      formData.append('description', description);
      formData.append('type', typeNew);
      formData.append('dataId', DataId);
      formData.append('userId', UserID);
      // Check if a file is selected before appending it
      if (selectedFile && selectedFile[0]) {
        formData.append('file', selectedFile[0]);
      }
    
      try {
        const response = await fetch(`${API_NEW_URL}log-note/add`, {
          method: 'POST',
          body: formData,
          headers: {
            'X-API-Key': X_API_Key,
          },
        });
        const data = await response.json();
        if(data.success === true){
          alert("Log Note created successfully")
          GetLogNote(DataId);
        }else if(data.message === "Log Note already exists"){
          alert("Log Note already exists")
        }
      } catch (error) {
        console.error(error);
      }
    };

    const GetLogNote = async (DataId) => {
      const apiUrl = `${API_NEW_URL}log-note/list/${DataId}?name=&page=1&limit=10'`;
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": X_API_Key,
          },
        });
  
        const data = await response.json();
        if(data.status === true){
          setLogHistory(data.NewLogNote);
        }
      } catch (error) {
        console.log(error);
      }
    };


    // const GetLogNote = async (e) => {
    //   const UrlToHit = `${API_NEW_URL}log-note/add/66596ee9bc4187b8bf5ae02f?name=&page=1&limit=10`;
    //   try {
    //     const response = await fetch(UrlToHit, {
    //       method: 'GET',
    //       headers: {
    //         'X-API-Key': X_API_Key,
    //         'Content-Type': 'application/json',
    //       },
    //     });
    //     const data = await response.json();
    //     console.log(data);
    //   } catch (error) {
    //     console.error('Error fetching log note:', error);
    //   }
    // };

    const isImage = (filename) => {
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
      const extension = filename.split('.').pop().toLowerCase();
      return imageExtensions.includes(extension);
    };
    


    function formatDate(isoDateString) {

      const date = new Date(isoDateString);
      const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
      ];
      const day = date.getUTCDate();
      const month = monthNames[date.getUTCMonth()];
      const year = date.getUTCFullYear();

      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');

      const formattedDate = `${day} ${month} ${year} ${hours}:${minutes}`;  
      return formattedDate;
  }


  return (
    <div className="mb-5">
      <p className="mb-5 border-b border-b-gray-400 pb-2 text-left font-dm text-lg font-bold text-gray-900">
        Log Note
      </p>
      <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-1 flex-col gap-5 rounded-md border border-gray-300 bg-white p-2">
          <div>
            <label>Description</label>
            <input
              type="text"
              className="mr-2 w-full flex-grow rounded-md border border-gray-300 p-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>    
          <div>
          {/* <label htmlFor="File">📎</label> */}
            <input
                id="File"
                type="file"
                onChange={(e) => setSelectedFile(e.target.files)}
              />
          </div>
          <div className="mt-1 flex gap-5">
          <button type="submit" className="text-white rounded-md bg-blueSecondary py-1 px-3 text-sm">Create Log Note</button>
          </div>  
        </div>
      </form>
      {LogHistory ?<>
      <div className="flex flex-col gap-4 mt-4">
        {LogHistory.map((item, index)=>(
          <div key={index} className="max-w-[400px] bg-blue-300 p-2 rounded-lg">
            <div className="flex justify-between">
              <p className="text-xs capitalize pb-2">~ {" "} {item.userId.username} ({item.userId.name})</p>
              <p className="text-xs capitalize pb-2">{formatDate(item.createdAt)}</p>
            </div>

            <div className="bg-white p-2 rounded-lg">
              <p>{item.description}</p>
              {item.fileUrl ?<>
                {isImage(item.fileUrl) ? (
                  <img src={DOC_URL + item.file} className="w-24 h-24 object-contain" alt={item.description}/>
                ) : (
                  <a
                  className="rounded-lg w-36 h-24 bg-white p-2 text-sm flex flex-col justify-center items-center"
                  href={DOC_URL + item.file} target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                    <span className="bg-blue-500 text-white p-0 px-2 rounded-full">View Document</span>
                  </a>
                )}
              </>:<></>}
            </div>
          </div>
        ))}
      </div>
      </>: null}
      </div>
    </div>
  );
};

export default InternalNote;
