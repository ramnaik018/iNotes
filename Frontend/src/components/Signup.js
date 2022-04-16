import React,{useState} from 'react'
import { useHistory } from 'react-router-dom'

const Signup = (props) => {
    
    const [cred, setcred] = useState({name:"",email:"",password:"",cpassword:""})
    let history = useHistory()
    const onChange = (e)=>{
        setcred({...cred, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()
        const response = await fetch('https://inotes-backend.herokuapp.com/api/auth/createUser', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({name: cred.name,email: cred.email,password: cred.password }),
          });
          const json = await response.json();
        //   console.log(json)
          if(json.success){
              //redirect
              localStorage.setItem('token',json.authToken)
              history.push("/") 
              props.showAlert("Account created successfully","success")
          }
          else{
            props.showAlert("Invalid Credentials","danger")
          }
    }
    return (
        <div className="mt-3" style={{width:"60%", margin:"2rem auto"}}>
            <h1>Create a account in iNotebook</h1>
            <form onSubmit={handleSubmit} className="my-4" >
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" className="form-control" id="name" name="name" value={cred.name} onChange={onChange} aria-describedby="emailHelp"/>
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" name="email" value={cred.email} onChange={onChange} aria-describedby="emailHelp"/>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" name="password" value = {cred.password} onChange={onChange} minLength={5} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                <input type="password" className="form-control" id="cpassword" name="cpassword" value = {cred.cpassword} onChange={onChange} minLength={5} required/>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Signup
