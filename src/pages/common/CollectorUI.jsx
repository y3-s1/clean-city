import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomeCollector from '../wasteCollection/collector/HomeCollector'
import HeaderCollector from '../../components/wasteCollection/HeaderCollector'
import TodaySchedule from '../wasteCollection/collector/TodaySchedule'

const CollectorUI = () => {
  return (
    <div>
      <HeaderCollector />
      <Routes>
        <Route path="/" element={<HomeCollector />} />
        <Route path="/todaySchedule" element={<TodaySchedule />} />
      </Routes>
    </div>
  )
}

export default CollectorUI