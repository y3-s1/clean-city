import { Route, Routes } from 'react-router-dom'
import HomeResident from './HomeResident'
import HeaderResident from '../../components/common/HeaderResident'

const ResidentUI = () => {
  return (
    <>
      <HeaderResident />
      <Routes>
          <Route path="/" element={<HomeResident />}></Route>
      </Routes>
    </>
  )
}

export default ResidentUI