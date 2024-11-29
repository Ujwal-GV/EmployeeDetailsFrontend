import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import SignUp from './components/SignUp'
import MainPage from './components/MainPage'
import EmployeeList from './components/EmployeeList'
import CreateEmployee from './components/CreateEmployee'
import EditEmployee from './components/EditEmployee'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <Login /> } />
        <Route path="/signup" element={ <SignUp /> } />
        <Route path="/main" element={ <MainPage /> }/>
        <Route path="/employees" element={ <EmployeeList /> }/>
        <Route path="/create-employee" element={ <CreateEmployee  />} />
        <Route path="/edit-employee/:id" element={ <EditEmployee /> } />
      </Routes>
    </Router>
  )
}

export default App
