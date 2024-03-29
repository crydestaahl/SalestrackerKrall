import React, { useEffect, useState } from 'react';
import './App.css';
import { Fade } from 'react-awesome-reveal';
import logo from './kralllogo.png';

function App() {
  const [data, setData] = useState(null);
  const [expandedIndex] = useState(null);
  const [inputData, setInputData] = useState('LWZJ7J');
  const [loading, setLoading] = useState(false); // state variable for loading status
  const [apiKey, setApiKey] = useState('LWZJ7J');

  useEffect(() => {
    const fetchData = () => {
      localStorage.clear();
      setLoading(true);
      fetch(
        `https://proxyserversalestracker.onrender.com/https://manager.tickster.com/Statistics/SalesTracker/Api.ashx?keys=${apiKey.trim()}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setData(data);
          // Spara data i local storage -
          localStorage.setItem('cachedData', JSON.stringify(data));
          setLoading(false);
        }) 
        .catch((error) => console.error(error));
    };
    fetchData();
  }, [apiKey]);

  const handleFocus = () => {
    setInputData('');
  };

  const handleInput = (e) => {
    const newInput = e.target.value.toUpperCase();
    setInputData(newInput.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveInput();
    }
  };

  const refresh = () => {
    window.location.reload();
  };

  const saveInput = () => {
    setData('');

    if (inputData.length === 6) {
      localStorage.clear();
      setLoading(true);

      fetch(
        `https://proxyserversalestracker.onrender.com/https://manager.tickster.com/Statistics/SalesTracker/Api.ashx?keys=${apiKey.trim()}`
      )
        .then((response) => response.json())
        .then((data) => {
          setData(data);
          // Spara data i local storage -
            localStorage.setItem('cachedData', JSON.stringify(data));
            setApiKey(inputData);
            setLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert('Felaktig nyckel, försök igen.');
      window.location.reload();
    }
  };

  function formatTime(timeStr) {
    const date = new Date(timeStr);
    const isoString = date.toISOString();
    const formattedDate = isoString.substring(0, 10);
    const formattedTime = isoString.substring(11, 16);
    return formattedDate + ' ' + formattedTime;
  }

  if (!data) {
    return (
      <div className='keyInput'>
        <a href="https://diggilootrackers.netlify.app/"><img src={logo} alt='Krall' className='logo'/></a>
        {loading ? (
          <div>
            <p className='loading'>Laddar data</p>
            <p className='loadingText'>
              Detta kan ta lite tid om det är första gången du hämtar data på
              denna nyckeln.
            </p>
          </div>
        ) : (
          <p></p>
        )}
      </div>
    );
  }

  if (!data) {
    return (
      <div className='keyInput'>
        <img src={logo} alt='Krall' className='logo' />
        <h3>Salestrackernyckel:</h3>
        <input
          type='text'
          value={inputData}
          onChange={handleInput}
          placeholder='T ex 12345'
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
        />
        <button onClick={saveInput}>Hämta</button>
        {!loading ? '' : ''}
      </div>
    );
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <div className='eventFeed'>
          <a href="https://diggilootrackers.netlify.app/"><img src={logo} alt='Krall' className='logo'/></a>
          {loading ? <p className='loading'>Laddar data</p> : <p></p>}
          {!loading  ? (
            data.map((item, index) => (
              <Fade>
                <div
                  className={`eventCard ${
                    index === expandedIndex ? 'transition' : ''
                  }`}
                  key={item.erc}
                  loading='lazy'
                >
                  <div className='eventInfo' key={item.erc}>  
                    <h3 className='eventName'>{item.name}</h3>
                    <h4>Start: {formatTime(item.startLocal)}</h4>
                    

                    {item.gfs
                      .filter(ticket => 
                        ticket.name !== "Tillgänglighetsanpassad plats" &&                         
                        ticket.name !== "Sittplats i det gröna" && 
                        ticket.name !== "Ledsagare i det gröna" &&
                        ticket.name !== "Ledsagare" &&
                        ticket.name !== "Parkett B" &&
                        ticket.name !== "Parkett A" &&
                        ticket.name !== "Drottning Silvias Barnsjukhus" &&
                        ticket.name !== "Barn t.o.m. 14 år"
                      ) // filter out tickets that have type 1
                      .map(ticket => ( // map over the filtered tickets
                       <div className='ticketInfo'>
                        <p><b>{ticket.name + ': '}</b></p>
                        <p>Sålt antal:  <b>{ticket.soldQtyNet} </b></p>
                       </div>                        
                      ))}


                    <img src={item.img.thumb} alt={item.name} />
                    <div className='scannedTickets'></div>
                  </div>
                </div>
              </Fade>
            ))
          ) : (
            <p className='error'>Nyckeln tillhör inte Krall</p>
          )}
          <button className='refresh' onClick={refresh}>
            Ladda om sidan
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
