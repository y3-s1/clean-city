import { Route, Routes } from 'react-router-dom'
import HomeResident from './HomeResident'
import HeaderResident from '../../components/common/HeaderResident'
// import MonitorWaste from '../../components/resident/WasteLevelMonitoring'
import ResidentDashboard from '../resident/dashboard/residentDashboard'

const ResidentUI = () => {
  return (
    <>
      <HeaderResident />
      <Routes>
          <Route path="/" element={<HomeResident />}></Route>
          <Route path="/my-waste/*" element={<ResidentDashboard />}></Route>
          
      </Routes>
    </>
  )
}

export default ResidentUI