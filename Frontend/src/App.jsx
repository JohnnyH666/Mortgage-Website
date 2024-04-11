import React from 'react';
import './App.css'
import {BrowserRouter as Router, Routes, Route, useLocation , Navigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/login'
import Register from './pages/Register';
import Home from './pages/Home'
import UserLoanApplications from './pages/UserLoanApplications'
import Header from './components/Header';
import MyProfile from './pages/MyProfile';
import Recover_password from './pages/recover_password';
import Privacy from './pages/Privacy';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './pages/ProtectedRoute';
import LoanCalculator from './pages/LoanCalculator';
import LoanLimitCalculator from './pages/LoanLimit';
import StaffLoanPackages from './pages/StaffLoanPackages';
import StaffLoanApplications from './pages/StaffLoanApplications';
import UserLoanPackages from './pages/UserLoanPackages';
import SearchHouses from './pages/SearchHouses';
import UserBookings from './pages/UserBookings';
import StaffBookings from './pages/StaffBookings';
import HomeCustomer from './pages/HomeCustomer';

function App() {

  const [userType, setUserType] = useState("");
  const [token, setToken] = useState("");
  // UseEffect will check to see when the token changes, and update access effectively
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    const userType = JSON.parse(localStorage.getItem("userType"));
    console.log(token, userType);
    if (token && userType) {
      setToken(token);
      setUserType(userType);
    }
  }, [token]);

  const reloadLocation = localStorage.getItem('reloadLocation');

  localStorage.removeItem('reloadLocation');

  return (
    <Router>
      <Header token={token} setToken = {setToken} userType = {userType} setUserType = {setUserType}/>
      <Routes>
        <Route path="/" element={<Navigate replace to={reloadLocation || "/login"} />} />
        <Route path="/login" element={<Login token={token} setToken = {setToken} userType = {userType} setUserType = {setUserType} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recover_password" element={<Recover_password/>} />
        <Route path="/reset_password" element={<ResetPassword/>} />
        <Route path="/loan-calculator" element={<LoanCalculator />} />
        <Route path="/loan-limit" element={<LoanLimitCalculator />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/home-customer" element={<HomeCustomer/>} />
        <Route path="/staff-loan packages" element={<StaffLoanPackages />} />
        <Route path="/user-bookings" element={<UserBookings />} />
        {/* <Route path="/home" element={<Home />} /> */}
        <Route element={<ProtectedRoute token={token} userType={userType}/>}>
        <Route path="/my-profile" element={<MyProfile />} />  
        <Route path="/user-loan applications" element={<UserLoanApplications />} />
        <Route path="/user-loan packages" element={<UserLoanPackages />} />
         <Route path="/staff-loan applications" element={<StaffLoanApplications />} />
         <Route path="/search-houses" element={<SearchHouses />} />
        <Route path="/privacy" element={<Privacy/>}/>
        <Route path="/staff-bookings" element={<StaffBookings/>}/>
          {/*
          {/*
          <Route path="/loan-calculator" element={<LoanCalculator />} />
          <Route path="/loan-packages" element={<LoanPackages />} />
          <Route path="/bookings" element={<Bookings />} />*/}
          
          {/* add other routes here */}
        </Route>
      </Routes>
    </Router>
  )
}

export default App
