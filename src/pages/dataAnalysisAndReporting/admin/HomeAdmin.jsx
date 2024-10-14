import React from 'react'
import AdminMonitoring from '../../../components/dataAnalysisAndReporting/AdminMonitoring'
import WasteCollectionScheduler from '../../../components/dataAnalysisAndReporting/WasteCollectionScheduler'
import AllSchedules from '../../../components/dataAnalysisAndReporting/AllSchedules'

function HomeAdmin() {
  return (
    <>
    <AdminMonitoring/>
    <WasteCollectionScheduler/>
    {/* <AllSchedules/> */}
    </>
  )
}

export default HomeAdmin