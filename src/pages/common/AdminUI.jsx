import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomeAdmin from '../dataAnalysisAndReporting/admin/HomeAdmin'
import AddStaff from '../dataAnalysisAndReporting/admin/AddStaff'
import AdminMenu from '../../components/dataAnalysisAndReporting/AdminMenu'
import '../../css/admin.css'
import ViewStaff from '../dataAnalysisAndReporting/admin/ViewStaff'
import ScheduleWasteCollection from '../dataAnalysisAndReporting/admin/ScheduleWasteCollection'

const AdminUI = () => {
  return (
    <>
    <AdminMenu/>
    <div className="crm-content p-4">
    <Routes>
        <Route path="/" element={<HomeAdmin />}></Route>
        <Route path="/addStaff" element={<AddStaff />}></Route>
        <Route path="/viewStaff" element={<ViewStaff />}></Route>
        <Route path="/scheduleCollecting" element={<ScheduleWasteCollection />}></Route>
    </Routes>
    </div>
    </>
  )
}

export default AdminUI