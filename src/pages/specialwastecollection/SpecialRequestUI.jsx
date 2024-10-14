import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ResidentSwHeader from './ResidentSwHeader'
import ResidentSwRequest from './ResidentSwRequest'
import SpecialRequestList from './SpecialRequestList'
import SpecialWasteHelp from './SpecialWasteHelp'

const SpecialRequestUI = () => {
  return (
    <div>
        <ResidentSwHeader></ResidentSwHeader>
        
        <Routes>
            <Route>
                <Route path="/specialRequest" element={<ResidentSwRequest />}></Route>
                <Route path="/" element={<SpecialRequestList />}></Route>
                <Route path="/help" element={<SpecialWasteHelp />}></Route>
            </Route>
        </Routes>
    </div>
  )
}

export default SpecialRequestUI