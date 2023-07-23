import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../../store.js'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Cookies from 'js-cookie'
import Button from '../Button/Button'
import envBox from '../../config.js';

const ProductCard = (props) => {
   const { name, description, price, sku, stock, _id } = props.props
   // get data from redux (if exist) and show button add cart below
   const user = useSelector(selectUser)
   const navigate = useNavigate()

   // Fetch on button
   const handleAddProduct = async evt => {
      evt.preventDefault()
      const response = await fetch(`${envBox.apiUrl}/carts/product/${_id}`, {
         method: 'POST',
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Cookies.get(envBox.cookieName)}`,
         },
      })
      if (!response.ok) {
         const error = await response.json() || 'Error'
         toast.error(error.message, { position: toast.POSITION.BOTTOM_CENTER })
      }
      else {
         toast.success(`Product "${name}" added to cart`, { position: toast.POSITION.BOTTOM_CENTER })
         navigate('/cart')
      }
   }

   return (

      <div className="uk-card uk-card-default">
         <div className="uk-card-header">
            <div className="uk-grid-small uk-flex-middle" uk-grid="">
               {/* <div className="uk-width-auto"><img className="uk-border-circle" width="40" height="40" src="images/avatar.jpg" alt="Avatar"/></div> */}
               <div className="uk-width-expand">
                  <h3 className="uk-card-title uk-margin-remove-bottom">{name}</h3>
                  <p className="uk-text-meta uk-margin-remove-top">
                     <small>Stock: {stock}</small>
                     <span> | </span>
                     <small>Sku: {sku}</small>
                  </p>
               </div>
            </div>
         </div>
         <div className="uk-card-body">

            <h5>${price}</h5>
            <p>{description}</p>
         </div>
         { user.data && 
            <div className="uk-card-footer">
               <ul className='uk-grid-small uk-width-auto' data-uk-grid="">
                  <li>
                     <Button style='primary' onClick={handleAddProduct}>+ <span data-uk-icon="cart"></span></Button>
                  </li>
               </ul>
            </div>
         }
      </div>
   )
}

export default ProductCard
