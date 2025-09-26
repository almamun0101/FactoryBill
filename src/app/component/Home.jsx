import React from 'react'
import Navbar from './Navbar'
import Machines from './Machines'
import Electricity from './Electricity'
import FloatingAddButton from './FloatingAddButton'

const Home = () => {
  return (
    <div>
        <div className="max-w-5xl mx-auto">
        
        <Electricity/>
        <FloatingAddButton/>

        </div>
    </div>
  )
}

export default Home