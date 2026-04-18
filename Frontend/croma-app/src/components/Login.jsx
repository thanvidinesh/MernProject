import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import "./Login.css";

function Login() { const navigate = useNavigate(); 
  const [isSignup, setIsSignup] = useState(false); 
  const [email, setEmail] = useState("");
   const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
     const handleSubmit = async () => 
      { const url = isSignup ? "http://localhost:5000/signup" :
         "http://localhost:5000/login";
       const body = isSignup ? { email, phone, password } : { email, password }; 
       try { const res = await fetch(url,
        { method: "POST",
           headers: { "Content-Type": "application/json" }, 
           body: JSON.stringify(body) });
        const data = await res.json();
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          alert(data.message);
          navigate("/");
        } else {
          alert(data.message || "Login failed");
        }
       } catch (error) { 
         alert("Backend not running or error: " + error.message);
       } };
       return  <div className="overlay">
         <div className="popup">
           <button className="close-btn" onClick={() => navigate("/")} > × 
            </button> <div className="tabs">
               <span onClick={() => setIsSignup(false)}>Login</span> 
               <span className="or">OR</span> <span onClick={() => setIsSignup(true)}>Create Account</span> 
               </div> <p className="subtitle"> Please enter your Email ID or Phone number </p>
                <div className="input-box"> <input type="text" placeholder="Enter Email or Phone"
                 value={email} onChange={(e)=>setEmail(e.target.value)} /> </div>
                  {isSignup && ( <div className="input-box"> <input type="text" 
                  placeholder="Enter Phone" 
                  value={phone} 
                  onChange={(e)=>setPhone(e.target.value)} 
                  />
                   </div> )} 
                   <div className="input-box">
                     <input type="password" placeholder="Enter Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                 </div> 
                <button className="submit-btn" 
              onClick={handleSubmit}> 
            Submit </button> 
          </div> 
        </div> 
    ; }
                      
export default Login;