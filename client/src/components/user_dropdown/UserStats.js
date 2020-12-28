import React, { useState, useEffect } from 'react';
import {CanvasJSChart} from 'canvasjs-react-charts'
import './user_dropdown.css'
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from "react-redux";
import SalesChart from './SalesChart';
import ProfitsChart from './ProfitsChart';


const UserStats = () => {

  const userId = useSelector(store => store.session.currentUser.id)
  const [salesData, setSalesData] = useState([])
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

  const options = {
    animationEnabled: true,
    // exportEnabled: true,
    theme: 'light2',
    title: {
      text: 'Sales'
    },
    axisY: {
      title: 'Number of Sales'
    },
    axisX: [
      {
        title: 'Month of the Year',
        interval: 1
      },
    ],
    data: [{
      type: 'line',
      // toolTipContent: `${months[x]}`,
      dataPoints: salesData
    }]
  }
  const graph_1 = (
    <div className="chart-data">
      <CanvasJSChart options={ options } />
    </div>
  )

  return (
    <>
      <div className="stats-buttons">
        <div>
        <Button aria-controls="simple-menu" aria-haspopup="true"  variant={salesButtonState ? 'contained' : 'outlined'} color="primary" onClick={handleClick} name="sales">
          Sales
        </Button>
        </div>
        <div className="button-divider"></div>
        <div>
        <Button aria-controls="simple-menu" aria-haspopup="true"  variant={profitsButtonState ? 'contained' : 'outlined'} color="primary" onClick={handleClick} name="profits">
          Profits
        </Button>
        </div>
      </div>
      <div>
        {/* <CanvasJSChart options={ options } /> */}
        {salesButtonState ? <SalesChart /> : <ProfitsChart />}
      </div>
    </>
  )
}

export default UserStats;
