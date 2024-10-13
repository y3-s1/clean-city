import { Route, Routes } from 'react-router-dom'
import HomeResident from './HomeResident'

const ResidentUI = () => {
  return (
    <>
        <Routes>
            <Route path="/" element={<HomeResident />}></Route>
        </Routes>
    </>
  )
}

export default ResidentUI