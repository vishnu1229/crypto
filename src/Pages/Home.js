import React, { useEffect, useState } from 'react';

import '../Styles/Home.css';
import { TextField } from '@material-ui/core';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import images from "../assets/index"

const Home = () => {
  const navigate = useNavigate();


  const [coin,setCoin] = useState("BTC");
  const [currency,setCurrency] = useState("USD");

  const [loading,setLoading] = useState(false);
  const [prediction,setPrediction] = useState(null);
  const [error,setError] = useState(false);
  const [pdata,setPdata] = useState([]);
  const [predictedValue,setPredictedValue] = useState(0);
  const [coinname, setCoinName] = useState('');

  var p_data = []

  const [apiBody,setBody] = useState({
    "coin_symbol":coin,
    "in_currency":currency
  });
  const handleHistoryData = () => {
    navigate('/history');
  }
  const handleInputChange = (event) => {
    setCoinName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/history/${coinname}`);
  };


  const submitClicked = () => {
    setLoading(true);
    setPrediction(false);
    setBody({
      "coin_symbol":coin,
      "in_currency":currency
    })

    //Call Api from server and set Prediction Data
    axios.post("http://localhost:5000/get-price-prediction",apiBody)
    .then(res => {
      setPrediction(JSON.parse(res.data).price_data)
      console.log("Result: ",JSON.parse(res.data).predicted_price)
      setPredictedValue(JSON.parse(res.data).predicted_price)
      setLoading(false); 
    })
    .catch(err => {
      console.log(err);
      setError(true);
      setLoading(false);
    });
  }

  useEffect(() => {
    console.log("Prediction: ",prediction)
    if(prediction!=null && prediction) {
      for(let i=0;i<=287;i++) {
        let temp = {
          "High": prediction["High"][i],
          "Low": prediction["Low"][i],
          "Open": prediction["Open"][i],
          "Close": prediction["Close"][i]
        }
        p_data.push(temp);
      }
      setPdata(p_data);
      console.log("Pdata : ",pdata);
    }
    
  },[loading,error,prediction,predictedValue]);
  const renderChart = () => {
    if (prediction != null) {
      return (
   
        <div className="chart-bg">
        <ResponsiveContainer className='prediction_container' aspect={3} width="100%" height={400}>
          <LineChart data={pdata}>
            <CartesianGrid />
            <XAxis dataKey="Time" interval={'preserveStartEnd'} />
            <YAxis>Value</YAxis>
            <Legend />
            <Tooltip />
            <Line dataKey="High" stroke="red" dot={{ r: 4 }} activeDot={{ r: 8 }} strokeWidth="3" />
            <Line dataKey="Low" stroke="blue" dot={{ r: 4 }} activeDot={{ r: 8 }} strokeWidth="3" />
            <Line dataKey="Open" stroke="green" dot={{ r: 4 }} activeDot={{ r: 8 }} strokeWidth="3" />
            <Line dataKey="Close" stroke="grey" dot={{ r: 4 }} activeDot={{ r: 8 }} strokeWidth="3" />
          </LineChart>
        </ResponsiveContainer>
        </div>
      
      );
    }
    return null;
  }

  return (
    <>
      <div className='topNavbar'>
        <div className='logo'>
          <img src={images.logo} alt="Logo" />
        </div>
        <div className='logoname'>CRYPTO-PREDICT</div>
        

        <div className='hitxt'>Hi, Welcome</div>
      
      </div>
      <div className='line'></div>
      <div className='box'>
        <div className='innerbox'>
          <div>Coin Symbol:</div>
          <TextField
            type="text"
            value={coin}
            onChange={(e) => setCoin(e.target.value)}
            className='inputfield'
          />
        </div>
        <div className='innerbox'>
          <div>Currency Symbol:</div>
          <TextField
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className='inputfield'
          />
        </div>
        <div className='innerbox'>
          <div>Coin Name:</div>
          <TextField
            type='text'
            value={coinname}
            onChange={handleInputChange}
            className='inputfield'
            
          />
        </div>
        <div className='innerbox'>
          <div>
            <button 
onClick={submitClicked} className='btn' >Predict </button>
<button  className='btnp' onClick={handleSubmit}>See Past Prediction</button>

</div>
</div>
</div>
{loading && <h3>Loading....</h3>}
{error && <h3>Some Error has occurred....</h3>}
{renderChart()}
</>
)
}

export default Home;