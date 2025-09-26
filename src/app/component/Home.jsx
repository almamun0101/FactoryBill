import React from 'react'
import Navbar from './Navbar'
import Machines from './Machines'
import Electricity from './Electricity'
import FloatingAddButton from './FloatingAddButton'

const Home = () => {
  return (
    <div>
        <Navbar/>
        <Machines/>
        <Electricity/>
        <FloatingAddButton/>
    </div>
  )
}

export default Home