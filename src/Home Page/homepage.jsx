import React, { useEffect } from 'react'

export default function Homepage() {
    useEffect(() => {
        document.title = "VistaFeedd"
    })
  return (
    <div className='webbody' style={{backgroundColor: 'black',display: 'flex', flexDirection:'row'}}>
      <div className="jrnvfnvkfmv">
      <div className="jjvnkvn">
  <svg width="100" height="30" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="30" fill="black" rx="5" />
    <text
      x="50%"
      y="50%"
      fontFamily="'Lobster', cursive"
      fontSize="21"
      fill="white"
      textAnchor="middle"
      alignmentBaseline="middle"
      dominantBaseline="middle"
    >
      VistaFeedd
    </text>
  </svg>
</div>


      </div>
    </div>
  )
}
