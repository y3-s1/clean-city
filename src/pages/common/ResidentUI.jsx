import { Route, Routes } from 'react-router-dom'
import HomeResident from './HomeResident'
import HeaderResident from '../../components/common/HeaderResident'
import MyQRCodes from '../wasteCollection/resident/MyQRCodes'

const ResidentUI = () => {
  return (
    <>
      <HeaderResident />
      <Routes>
          <Route path="/" element={<HomeResident />}></Route>
          <Route path="/myQRCodes" element={<MyQRCodes />}></Route>
      </Routes>
    </>
  )
}

export default ResidentUI