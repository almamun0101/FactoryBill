import React from 'react'
import Navbar from './Navbar'
import Machines from './Machines'
import Electricity from './Electricity'

const Home = () => {
  return (
    <div>
        <Navbar/>
        <Machines/>
        <Electricity/>
    </div>
  )
}

export default Home