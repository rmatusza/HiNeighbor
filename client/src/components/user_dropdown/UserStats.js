import React, { useState } from 'react';
import './user_dropdown.css'
import Button from '@material-ui/core/Button';
import SalesChart from './SalesChart';
import ProfitsChart from './ProfitsChart';


const UserStats = () => {

  // const [salesData, setSalesData] = useState([])
  const [salesButtonState, setSalesButtonState] = useState(true)
  const [profitsButtonState, setProfitsButtonState] = useState(false)

  const handleClick = (e) => {
    if(e.target.name === 'profits') {
      if(profitsButtonState === false) {
        setProfitsButtonState(true)
        setSalesButtonState(false)
      } else {
        setProfitsButtonState(false)
        setSalesButtonState(true)

      }
    } else {
      if(salesButtonState === false) {
        setSalesButtonState(true)
        setProfitsButtonState(false)

      }else {
        setSalesButtonState(false)
        setProfitsButtonState(true)
      }
    }
  }

  return (
    <>
      <div className="background">
      <div className="stats-buttons">
        <div>
        <Button aria-controls="simple-menu" aria-haspopup="true"  variant={salesButtonState ? 'contained' : 'outlined'} color="secondary" onClick={handleClick} name="sales">
          Sales
        </Button>
        </div>
        <div className="button-divider"></div>
        <div>
        <Button aria-controls="simple-menu" aria-haspopup="true"  variant={profitsButtonState ? 'contained' : 'outlined'} color="secondary" onClick={handleClick} name="profits">
          Profits
        </Button>
        </div>
      </div>
      <div>
        {/* <CanvasJSChart options={ options } /> */}
        {salesButtonState ? <SalesChart /> : <ProfitsChart />}
      </div>
      </div>
    </>
  )
}

export default UserStats;
