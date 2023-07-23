import { useRef } from "react"
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../../store.js'
import { fetchCookie } from '../../utils/useCookies.js'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import envBox from '../../config.js'

const Login = () => {

   const datForm = useRef()
   const navigate = useNavigate()
   const dispatch = useDispatch()

   const handlerSubmmit = async evt => {
      // Prevent default
      evt.preventDefault()
      // Html to iterable object
      const formData = new FormData(datForm.current)
      // Iterable to simple object
      const client = Object.fromEntries(formData)

      try {
         const fetchData = await fetch(`${envBox.apiUrl}/sessions/login`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(client),
            credentials: 'include' //todo WIP SOLUTION, NEEDS TO BE FIXED FOR SERVER CREATE COOKIE
         })

         const response = fetchData
         const data = await response.json()

         if (!response.ok) throw new Error (data.message)

         // CREATE COOKIE //todo Create cookie via react (need to be Express) 
         document.cookie = `${envBox.cookieName}=${data.token};expires=${new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toUTCString()};path=/`

         // Fetch simple user data
         const user = await fetchCookie()

         // Dispatch redux alert
         dispatch(setUser(user))

         // Notification
         toast.success('Login success', { position: toast.POSITION.TOP_CENTER })

         // Final navigate
         navigate('/')
      }
      catch (error) {
         toast.error(error.message, { position: toast.POSITION.TOP_CENTER })
      }
   }

   return (
      <div className="uk-container">
         <form onSubmit={handlerSubmmit} ref={datForm}>
            <fieldset className="uk-fieldset">
               <legend className="uk-legend">Login</legend>
               <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="email">Email</label>
                  <input className="uk-input" type="email" placeholder="Email" aria-label="Input" name="email" />
               </div>
               <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="password">Password</label>
                  <input className="uk-input" type="password" placeholder="Password" aria-label="Input" name="password" />
               </div>
               <div className="uk-margin">
                  <button className="uk-button uk-button-primary">Login</button>
               </div>
            </fieldset>
         </form>
      </div>
   )
}

export default Login
