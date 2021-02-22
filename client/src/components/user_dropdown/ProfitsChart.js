import React, { useState, useEffect } from 'react';
import {CanvasJSChart} from 'canvasjs-react-charts'
import './user_dropdown.css'
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from "react-redux";



const ProfitsChart = () => {

  const userId = useSelector(store => store.session.currentUser.id)
  const [profitData, setProfitData] = useState([])



  // const months = {1: 'Janurary', 2: 'Februrary', 3: 'March', 4: 'April', 5: 'May', 6: 'June', 7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'}
  let data =
  [
  { x: 1, y: 0, label: 'Janurary'},
  { x: 2, y: 0, label: 'Februrary' },
  { x: 3, y: 0, label: 'March' },
  { x: 4, y: 0, label: 'April' },
  { x: 5, y: 0, label: 'May' },
  { x: 6, y: 0, label: 'June' },
  { x: 7, y: 0, label: 'July' },
  { x: 8, y: 0, label: 'August' },
  { x: 9, y: 0, label: 'September' },
  { x: 10, y: 0, label: 'October' },
  { x: 11, y: 0, label: 'November' },
  { x: 12, y: 0, label: 'December' },
  ]

  const findIndex = {
    '01': 0,
    '02': 1,
    '03': 2,
    '04': 3,
    '05': 4,
    '06': 5,
    '07': 6,
    '08': 7,
    '09': 8,
    '10': 9,
    '11': 10,
    '12': 11
  }

  useEffect(() => {
    (async() => {
      const res = await fetch(`http://localhost:5000/api/users/${userId}/chart-data`)
      const items = await res.json()
      //('SALES DATA:', data)
      items.forEach(item => {
        let date = item.date_sold.slice(5, 7)
        let idx = findIndex[date]
        if(item.price !== item.current_bid) {
          data[idx].y += item.current_bid
        }else {
          data[idx].y += item.price
        }
      })
      setProfitData(data)
    })()
  }, [])


  const options = {
    animationEnabled: true,
    // exportEnabled: true,
    theme: 'light2',
    title: {
      text: 'Profits'
    },
    axisY: {
      title: 'Profit',
      prefix: '$'
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
      dataPoints: profitData
    }]
  }


  return (
    <>
      <div className="chart-data">
        <CanvasJSChart options={ options } />
      </div>
    </>
  )
}

export default ProfitsChart;
