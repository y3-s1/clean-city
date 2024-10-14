import { Route, Routes } from 'react-router-dom'
import HomeResident from './HomeResident'
import HeaderResident from '../../components/common/HeaderResident'
import SpecialRequestUI from '../specialwastecollection/SpecialRequestUI'

const ResidentUI = () => {
  return (
    <>
      <HeaderResident />
      <Routes>
          <Route path="/" element={<HomeResident />}></Route>
          <Route path="/specialWaste/*" element={<SpecialRequestUI />}></Route>
      </Routes>
    </>
  )
}

export default ResidentUI