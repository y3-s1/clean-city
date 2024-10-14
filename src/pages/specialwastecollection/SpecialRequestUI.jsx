import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ResidentSwHeader from './ResidentSwHeader'
import ResidentSwRequest from './ResidentSwRequest'

const SpecialRequestUI = () => {
  return (
    <div>
        <ResidentSwHeader></ResidentSwHeader>
        sdfdsf
        <Routes>
            <Route>
                <Route path="/specialRequest" element={<ResidentSwRequest />}></Route>
                {/* <Route path="/specialWaste" element={<SpecialRequestUI />}></Route> */}
            </Route>
        </Routes>
    </div>
  )
}

export default SpecialRequestUI