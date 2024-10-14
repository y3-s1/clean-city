import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomeCollector from '../wasteCollection/collector/HomeCollector'
import HeaderCollector from '../../components/wasteCollection/HeaderCollector'
import TodaySchedule from '../wasteCollection/collector/TodaySchedule'
import QRScanner from '../wasteCollection/collector/QRScanner'
import ConfirmationPage from '../wasteCollection/collector/ConfirmationPage';
import FullSessionDetails from '../wasteCollection/collector/FullSessionDetails'

const CollectorUI = () => {
  return (
    <div>
      <HeaderCollector />
      <Routes>
        <Route path="/" element={<HomeCollector />} />
        <Route path="/todaySchedule" element={<TodaySchedule />} />
        <Route path="/qrScanner" element={<QRScanner />} />
        <Route path="/confirmationPage/:decodedText" element={<ConfirmationPage />} />
        <Route path="/fullSessionDetails" element={<FullSessionDetails />} />
      </Routes>
    </div>
  )
}

export default CollectorUI