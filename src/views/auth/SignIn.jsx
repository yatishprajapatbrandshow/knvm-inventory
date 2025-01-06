import { useState, useEffect } from "react";

import Checkbox from "components/checkbox";
import {API_NEW_URL, X_API_Key} from "../../config";
import { useNavigate } from 'react-router-dom';
import authImg from "assets/img/auth/auth.png";
import { isSessionActive } from 'utils/sessionUtils';


export default function SignIn() {
  const navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("")
  const [Loder, setLoder] = useState(false)

  const Session = isSessionActive()
  useEffect(()=>{
    if(Session) navigate('/admin');
    }, [])


  const Login = async ()=>  {
    
    setLoder(true);
    const datas = {
      username : Email,
      password : Password
    };

    let errorMessages = [];
    if (datas.username === '') {
      errorMessages.push("Please Enter Username or Email");
    }
    if (datas.password === '') {
      errorMessages.push("Please Enter Password");
    }
    
    setErrorMessage(errorMessages)
    if (errorMessages.length > 0) {
        setLoder(false);
        return;
      }
    
    const apiUrl = `${API_NEW_URL}user/login`
    console.log(apiUrl);
    try { 
      const response = await fetch(apiUrl, {
        method: "POST",
        headers:{
          'Content-Type' : 'application/json',
          'X-API-Key': X_API_Key
        },
        body: JSON.stringify(datas)
      });
  
      const data = await response.json();
      console.log("dataSign", data);
      if(data.status === true){
        navigate('/admin');
        setLoder(false);
        localStorage.setItem('token', JSON.stringify(data.token));
        localStorage.setItem('userDetailKey', JSON.stringify(data.user));
      }else{
        alert(data.message)
        setLoder(false);
      }
    }catch (error) {
      setLoder(false);
    }

  }

  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      Login();
    }
  };
  
  return (
    <div className=" flex justify-center items-center relative w-full min-h-screen">
      <svg aria-hidden="true" className="absolute z-[-4] inset-0 h-full w-full opacity-[0.05]"><defs><pattern id=":S6:" width="30" height="30" patternUnits="userSpaceOnUse" x="50%" y="100%"><path d="M0 128V.5H128" fill="none" stroke="currentColor"></path></pattern></defs><rect width="100%" height="100%" fill="url(#:S6:)"></rect></svg>
      {/* Sign in section */}
      <div className="mt-[10vh] w-full flex-col items-center max-w-[420px] p-5 bg-white rounded-lg z-[5] shadow-lg">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign In
        </h4>
        <p className="mb-4 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
        </p>
        {ErrorMessage.length > 0 ?
            <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                    
                    </div>
                    <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">There were {ErrorMessage.length} errors with your submission</h3>
                    <div className="mt-2 text-sm text-red-700">
                        <ul role="list" className="list-disc space-y-1 pl-5">
                            {ErrorMessage.map((item, index)=>(
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    </div>
                </div>
            </div>
        : null}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          <p className="text-base text-gray-600 dark:text-white"> Login </p>
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
        </div>
        <input
            id="email"
            name="email"
            type="text"
            value={Email}
            placeholder="Enter your email or username here"
            onChange={(e) => {setEmail(e.target.value)}}
            required
            className="mt-5 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
        />
        <input
            id="password"
            name="password"
            type="password"
            value={Password}
            placeholder="Enter your password here"
            onChange={(e) => {setPassword(e.target.value)}}
            onKeyDown={handleEnterPress}
            required
            className="mt-5 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
        />

        <div className="mb-4 mt-5 flex items-center justify-between px-2">
          <div className="flex items-center">
            <Checkbox />
            <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">Keep me logged In</p>
          </div>
        </div>
        <div className="flex gap-5 items-center">
          <button onClick={Login} className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
            Sign In
          </button>
          {Loder ?
            <div role="status">
              <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
          </div>
          : null}
        </div>
        {/* <div className="mt-4">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
          Not registered yet?
          </span>
          <a
          href=" "
          className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
          Create an account
          </a>
        </div> */}
      </div>
      <div className="absolute test right-0 top-0 z-[-2] hidden h-full min-h-screen md:block lg:w-[49vw] 2xl:w-[44vw]">
          <div
            className="absolute flex h-full w-full items-end justify-center bg-cover bg-center lg:rounded-bl-[120px] xl:rounded-bl-[200px]"
            style={{ backgroundImage: `url(${authImg})` }}
          />
        </div>
    </div>
  );
}
