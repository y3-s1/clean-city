import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomeCollector from '../wasteCollection/collector/HomeCollector'
import HeaderCollector from '../../components/wasteCollection/HeaderCollector'

const CollectorUI = () => {
  return (
    <div>
      <HeaderCollector />
      <Routes>
        <Route path="/" element={<HomeCollector />} />
      </Routes>
    </div>
  )
}

export default CollectorUI