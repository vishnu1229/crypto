import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import axios from 'axios';
import querystring from "query-string";
import Home from './Pages/Home.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import History from './Pages/History';

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      
           <Route path="/history/:name" element={<History/>} />
    </Routes>
  </Router>
  );
}

export default App;
