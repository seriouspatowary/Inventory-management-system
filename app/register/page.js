"use client"
import Input from "@/components/Input";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

const defaultData = { name: "", username: "", password: "" };

const Register = () => {
    const [data, setData] = useState(defaultData);
    const [loading,setLoading] = useState(false);

    const router = useRouter();
    
    const onValueChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const onRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
           

        if (!data.username || !data.password || !data.name) {
            alert("Please fill all mandatory paramters");
            setLoading(false);
            return;
        }
        
        try {
            
            
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
        
              });
           
            setData(defaultData);


            if (response.status === 400) {
                alert("Username already exists");
                setLoading(false)
                return;

            }
            
            if (response.status === 200) {
                router.push('/');
                setLoading(false)
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
       <>
       <Header/>
        <div className="min-h-screen bg-gray-200 flex flex-col justify-center items-center">
            <div className="bg-white shadow-md rounded px-14 pt-9 py-6 pb-12 mb-4">
                <h1 className="text-3xl mb-4 text-center">Register</h1>
                <form className="space-y-4">
                    <Input 
                        label="Name"
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={onValueChange}
                    />
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
                        onClick={(e) => onRegister(e)}    
                    >
                        Submit
                    </button>
                </form>
                <p className="text-center mt-4">
                    Already have an account?{" "}
                    <Link href="/" className="text-blue-500 hover:underline">Login</Link>
                </p>
            </div>


{loading && (
  <div className="flex mx-auto px-20 py-5 w-60">
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

export default Register;