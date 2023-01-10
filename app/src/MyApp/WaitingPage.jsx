import React from 'react'
// import swal from '@sweetalert/with-react'
import swal from 'sweetalert'

export default function WaitingPage(){
  return(
    // swal(
    //   <div>
    //     <h1>Hello world!</h1>
    //     <p>
    //       This is now rendered with JSX!
    //     </p>
    //   </div>
    // )
    swal("Please wait...",{
      closeOnClickOutside: false,
      closeOnEsc: false,
      buttons: false
    })
  )
      
}
