"use client";

import Header from "@/components/Header";
import { useEffect, useState,useLayoutEffect } from "react";

import { useRouter } from "next/navigation";


export default function Home() {

  

  const [productForm, setProductForm] = useState({})
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("")
  const [dropdown, setDropdown] = useState([])

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const router = useRouter();

  useLayoutEffect(() => {
    const fetchSession = async () => {
        try {
            const response = await fetch('/api/session');
            const data = await response.json();
            console.log("data is " ,data)
            setIsLoggedIn(data.isLoggedIn);
        } catch (error) {
            console.error('Error fetching session:', error);
        }
    };

    fetchSession();
}, []);

useEffect(() => {
    if (isLoggedIn === false) {
        router.push('/');
    }
}, [isLoggedIn, router]);



  useEffect(() => {
    // Fetch user session status when component mounts
    fetchProducts();
  }, []);

 

 



//   useEffect(() => {
//     // Set a timeout to clear the alert after 30 seconds
//     const alertTimeout = setTimeout(() => {
//       setAlert("");
//     }, 10000);

//     // Clean up the timeout to prevent memory leaks
//     return () => clearTimeout(alertTimeout);
//   }, [alert]); 

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/product')
      let rjson = await response.json();
      setProducts(rjson.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };


  const addProduct = async (e) => {

    e.preventDefault();

    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productForm)

      });

      if (response.ok) {
        console.log('Product Added Successfully')
        setAlert('Your Product has been added')
        fetchProducts();
        setProductForm({})
      }
      else {
        console.log("Error adding product")
      }

    } catch (error) {

      console.error('Error:', error)
    }


  }
  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value })
  } 

  const buttonAction = async(action,slug,initialQuantity) =>{

       let index = products.findIndex((item)=> item.slug == slug)
       let newProducts = JSON.parse(JSON.stringify(products))

       if(action=="plus"){
          newProducts[index].quantity = parseInt(initialQuantity) + 1;
       }
       else{
        newProducts[index].quantity = parseInt(initialQuantity) - 1;
       }

       setProducts(newProducts)


       let indexdrop = dropdown.findIndex((item)=> item.slug == slug)
       let newDropdown = JSON.parse(JSON.stringify(dropdown))

       if(action=="plus"){
          newDropdown[indexdrop].quantity = parseInt(initialQuantity) + 1;
       }
       else{
        newDropdown[indexdrop].quantity = parseInt(initialQuantity) - 1;
       }

       setDropdown(newDropdown)




       console.log(action,slug)
       const response = await fetch('/api/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({action,slug,initialQuantity})
  });
  let r = await response.json();
  console.log(r);

}

  const onDropdownEdit = async (e) => {
    let value = e.target.value
    setQuery(value)

    if(value.length > 3)
    {
      setLoading(true);
       try {
      const response = await fetch(`/api/search?query=${query}`)
      let rjson = await response.json();
      setDropdown(rjson.products);
      setLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error);
    }}
    else{
      setDropdown([])
      setLoading(false)
    }
  }







  
 
  return (
    <>
      <Header />
      <div className="container  my-8 mx-auto px-10">
        <div className="text-green-800 text-center font-bold">{alert}</div>
        <div  className="flex mb-2"> 
  <input  onChange={onDropdownEdit} type="text" id="searchProduct" className="border rounded px-4 py-2 mr-2 w-full" placeholder="Search Product" />
  
  <select id="category" className="border rounded px-4 py-2">
    <option value="">All</option>
    {/* <option value="category2">Category 2</option>
    <option value="category3">Category 3</option> */}
  </select>
</div>

{loading && (
  <div className="flex mx-auto w-60">
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



        <div className="dropcontainer absolute w-[72vw] border-1 bg-purple-200 rounded-md">
          {dropdown.map(item => {
            return <div key={item.slug} className="container flex justify-between p-2 my-1  border-b-2">
              <span className="slug">{item.slug} ({item.quantity} available for ₹{item.price})</span>
              <div className="mx-5">
                <button onClick={()=>{buttonAction("plus", item.slug, item.quantity)}} className="add inline-block px-3 py-1 cursor-pointer bg-purple-500 text-white font-semibold rounded-lg shadow-md"> + </button>
              <span className="quantity inline-block min-w-3 mx-3">{item.quantity}</span>
              <button onClick={()=>{buttonAction("minus", item.slug, item.quantity)}} className="subtract inline-block px-3 py-1 cursor-pointer bg-purple-500 text-white font-semibold rounded-lg shadow-md"> - </button> </div>
            </div>
          })}
        </div>
      </div>

      <div className="container my-8  mx-auto px-10 mt-10">
        <h1 className="text-3xl font-bold mb-6">Add a Product</h1>
        {/* Additional content */}
        <form className="mb-8 max-w-md w-ful">
          <div className="mb-4">
            <label htmlFor="productName" className="block mb-2">Product Slug:</label>
            <input onChange={handleChange} value={productForm?.slug || ""} name="slug" type="text" id="productName" className="border rounded px-4 py-2 w-full" />
          </div>
          <div className="mb-4">
            <label htmlFor="quantity" className="block mb-2">Quantity:</label>
            <input onChange={handleChange} value={productForm?.quantity || ""} name="quantity" type="number" id="quantity" className="border rounded px-4 py-2 w-full" />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block mb-2">Price:</label>
            <input onChange={handleChange} value={productForm?.price || ""} name="price" type="text" id="price" className="border rounded px-4 py-2 w-full" />
          </div>
          <button onClick={addProduct} type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Product</button>
        </form>
      </div>

      <div className="container my-8 mx-auto px-10 ">
        <h1 className="text-3xl font-bold mb-6">Display Current stock</h1>

        <table className="table-auto border-collapse w-full">
          <thead>
            <tr>
              <th className="border px-4 py-2">Product Name</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody >
            {products.map(item => {
              return <tr key={item.slug} className="table-auto border-collapse w-full">
                <td className="border px-4 py-2">{item.slug}</td>
                <td className="border px-4 py-2">{item.quantity}</td>
                <td className="border px-4 py-2">₹{item.price}</td>
              </tr>
            })}


          </tbody>
        </table>

      </div>
    </>

  );
}
