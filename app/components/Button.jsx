'use client'
import React from 'react'

function Button(props) {
  return (
    <input type={props.type} className='w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' value={props.value} onClick={props.onClick} />
  )
}

export default Button