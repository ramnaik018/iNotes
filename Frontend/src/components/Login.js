import React,{useState} from 'react'
import { useHistory } from 'react-router-dom'

const Login = (props) => {
    const [cred, setcred] = useState({email:"",password:""})
    let history = useHistory()
    const onChange = (e)=>{
        setcred({...cred, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()
        const response = await fetch('https://inotes-backend.herokuapp.com/api/auth/login', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({email: cred.email,password: cred.password }),
          });
          const json = await response.json();
          if(json.success){
            //redirect
            localStorage.setItem('token',json.authToken)
            props.showAlert("Logged in successfully","success")
            history.push("/")
          }
          else{
              props.showAlert("Invalid Credentials","danger")
          }
    }
    return (
        <div className="mt-3" style={{width:"60%", margin:"2rem auto"}}>
            <h1>Login to iNotebook</h1>
            <form onSubmit={handleSubmit} className="my-4">
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" name="email" value={cred.email} onChange={onChange} aria-describedby="emailHelp"/>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" name="password" value = {cred.password} onChange={onChange}/>
            </div>
            
            <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login
