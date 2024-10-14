import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ResidentSwHeader from './ResidentSwHeader'
import ResidentSwRequest from './ResidentSwRequest'
import SpecialRequestList from './SpecialRequestList'
import SpecialWasteHelp from './SpecialWasteHelp'

const SpecialRequestUI = () => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <div className="flex-shrink-0">
        <ResidentSwHeader />
      </div>
      <div className="flex-grow-1 overflow-auto">
        <div className="p-3">
          <Routes>
            <Route path="/specialRequest" element={<ResidentSwRequest />} />
            <Route path="/" element={<SpecialRequestList />} />
            <Route path="/help" element={<SpecialWasteHelp />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default SpecialRequestUI