import React from 'react'
import Navbar from './Navbar'
import Machines from './Machines'
import Electricity from './Electricity'
import FloatingAddButton from './FloatingAddButton'

const Home = () => {
  return (
    <div>
        <Navbar/>
        <div className="max-w-5xl mx-auto">
        <Machines/>
        <Electricity/>
        <FloatingAddButton/>

        </div>
    </div>
  )
}

export default Home