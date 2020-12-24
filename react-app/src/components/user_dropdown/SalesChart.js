import React, { useState, useEffect } from 'react';
import {CanvasJSChart} from 'canvasjs-react-charts'
import './user_dropdown.css'
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from "react-redux";



const SalesChart = () => {

  const userId = useSelector(store => store.session.currentUser.id)
  const [salesData, setSalesData] = useState([])
  const [salesButtonState, setSalesButtonState] = useState(true)
  const [profitsButtonState, setProfitsButtonState] = useState(false)


  // const months = {1: 'Janurary', 2: 'Februrary', 3: 'March', 4: 'April', 5: 'May', 6: 'June', 7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'}
  let data =
  [
  { x: 1, y: 10, label: 'Janurary'},
  { x: 2, y: 5, label: 'Februrary' },
  { x: 3, y: 15, label: 'March' },
  { x: 4, y: 20, label: 'April' },
  { x: 5, y: 10, label: 'May' },
  { x: 6, y: 2, label: 'June' },
  { x: 7, y: 3, label: 'July' },
  { x: 8, y: 9, label: 'August' },
  { x: 9, y: 25, label: 'September' },
  { x: 10, y: 4, label: 'October' },
  { x: 11, y: 9, label: 'November' },
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
      const res = await fetch(`http://localhost:8080/api/users/${userId}/chart-data`)
      const items = await res.json()
      console.log('SALES DATA:', data)
      items.forEach(item => {
        let date = item.date_sold.slice(5, 7)
        let idx = findIndex[date]
        console.log(idx)
        data[idx].y += 1
        console.log(data)
      })
      setSalesData(data)
    })()
  }, [])

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

  const resetItem = async() => {
    // await fetch(`http://localhost:8080/api/items-and-services/${12}/unpurchase`,{
      //   method: 'PATCH'
      // })
    }

    const getCheese = async() => {
      // const res = await fetch(`http://localhost:8080/api/items-and-services/${12}/cheese`)
      // const {date} = await res.json()

      // const dateobj = new Date(date)
    // const diffDays = Math.round(Math.abs((dateobj - d1) / oneDay));

    // console.log(diffDays)
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
      <div className="chart-data">
        <CanvasJSChart options={ options } />
      </div>
    </>
  )
}

export default SalesChart;
