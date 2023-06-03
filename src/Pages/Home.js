import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import '../Styles/Home.css';
import { Button, TextField } from '@material-ui/core';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const navigate = useNavigate();


  const [coin,setCoin] = useState("BTC");
  const [currency,setCurrency] = useState("USD");

  const [loading,setLoading] = useState(false);
  const [prediction,setPrediction] = useState(null);
  const [error,setError] = useState(false);
  const [coinname, setCoinName] = useState('');
  const [pdata,setPdata] = useState([]);
  const [predictedValue,setPredictedValue] = useState(0);

  var p_data = []

  const [apiBody,setBody] = useState({
    "coin_symbol":coin,
    "in_currency":currency
  });

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

  

  return (
    <div>
        {/* <Header/> */}
        <div className='home_content'>
            <div className='top_bar'>

                <div className='header_logo' style={{fontSize:15,display:'flex',alignItems:'center',border:'6px solid black'}}>Crypto</div>

                <div className='entry_area'>
                    <h3 className='label'>Coin Symbol: </h3>
                    <TextField
                        type='string'
                        value={coin}
                        onChange={(e) => setCoin(e.target.value)}
                        className='entry'
                        InputProps={{ disableUnderline: true }}
                    />
                </div>
                <div className='entry_area'>
                    <h3 className='label'>Currency Symbol: </h3>
                    <TextField
                        type='string'
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className='entry'
                        InputProps={{ disableUnderline: true }}
                    />
                </div>
                <form onSubmit={handleSubmit} className='entry_areas'>
            <div className='entry_area'>
          <h3 className='label'>Coin name: </h3>
          <TextField
            type='string'
            value={coinname}
            onChange={handleInputChange}
            className='entry'
            InputProps={{ disableUnderline: true }}
          />
        </div>
        <Button type='filled' className='button_submit' onClick={handleSubmit}>
          History Data
        </Button>
      </form>

               
                <Button type='filled' className='button_submit' onClick={() => submitClicked()}>Predict</Button>

            </div>

            <div className='body'>
                {!error && !loading && prediction && <div className='prediction_area'>
                    <h1 className='prediction_title'>Crypto-Stock Prediction</h1>
                    <ResponsiveContainer className='prediction_container' aspect={3} width="75%" height={400}>
                        <LineChart data={pdata}>
                        <CartesianGrid/>
                        <XAxis dataKey='Time' interval={'preserveStartEnd'} />
                        <YAxis>Value</YAxis>
                        <Legend/>
                        <Tooltip/>
                        <Line dataKey="High" stroke='red' dot={{r:4}} activeDot={{ r: 8 }} strokeWidth="3"/>
                        <Line dataKey="Low" stroke='blue' dot={{r:4}} activeDot={{ r: 8 }} strokeWidth="3"/>
                        <Line dataKey="Open" stroke='green' dot={{r:4}} activeDot={{ r: 8 }} strokeWidth="3"/>
                        <Line dataKey="Close" stroke='grey' dot={{r:4}} activeDot={{ r: 8 }} strokeWidth="3"/>
                        </LineChart>
                    </ResponsiveContainer>
                    <div className='prediction'>
                        <h3>Next Predicted Value : </h3>
                        <h3 style={{paddingLeft:"1rem"}}>{predictedValue}</h3>
                    </div>
                </div>}
            </div>
            

            {loading && <h3 className='loading'>Loading....</h3>}
            {error && <h3 className='error'>Some Error has occured....</h3>}
        </div>
    </div>
  )
}

export default Home