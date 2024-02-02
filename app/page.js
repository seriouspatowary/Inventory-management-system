"use client"
import Input from "@/components/Input";
import { useState,useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

const defaultData = { username: "", password: "" };

const Login = () => {
    const [data, setData] = useState(defaultData);
    const[loading,setLoading] = useState(false);
   


    const router = useRouter();
    
    const onValueChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const onLogin = async (e) => {
        setLoading(true)
        e.preventDefault();

        if (!data.username || !data.password) {
            alert("Please fill all mandatory paramters");
            setLoading(false)
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
        
              });
            setData(defaultData);
           
            
            if (response.status === 200) {
                setLoading(false)
               
                router.push("/home")
    
            }
            if (response.status === 401) {
              setLoading(false)
              alert("Invalid Credentials")
        
  
          }
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    return (
         <>
         <Header/>
              <div className="min-h-screen bg-gray-200 flex flex-col justify-center items-center">
            <div className="bg-white rounded-lg border border-grey-800 px-16 pt-8 pb-12 mb-4 shadow-xl">
                <h1 className="text-3xl mb-4 text-center">Login</h1>
                <form className="space-y-4">
                    <Input
                        label="Username"
                        id="username"
                        type="text"
                        value={data.username}
                        onChange={onValueChange}
                    />
                    <Input
                        label="Password"
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={onValueChange}
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full"
                        onClick={(e) => onLogin(e)}
                    >
                        Sign In
                    </button>
                </form>
                <p className="text-center mt-4">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-blue-500 hover:underline">Register</Link>
                </p>
            </div>

{loading && (
  <div className="flex mx-auto px-20 py-10 w-60">
    <svg
      width="50px"
      height="50px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      className="lds-ring"
      style={{ background: 'none' }}
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        stroke="#000"
        strokeWidth="4"
        r="15"
        strokeDasharray="70.68583470577033 24.228611568590606"
        transform="rotate(209.135 50 50)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          calcMode="linear"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
          dur="1s"
          begin="0s"
          repeatCount="indefinite"
        ></animateTransform>
      </circle>
      <circle
        cx="50"
        cy="50"
        fill="none"
        stroke="#000"
        strokeWidth="4"
        r="23"
        strokeDasharray="143.2394487884533 49.08029959651536"
        strokeDashoffset="48.50829694622858"
        transform="rotate(-209.135 50 50)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          calcMode="linear"
          values="0 50 50;-360 50 50"
          keyTimes="0;1"
          dur="1s"
          begin="0s"
          repeatCount="indefinite"
        ></animateTransform>
      </circle>
    </svg>
  </div>
)}
        </div>
         
         </>
    );
}

export default Login;
