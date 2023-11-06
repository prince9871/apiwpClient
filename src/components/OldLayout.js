import './App.css'
import { useState } from 'react'
function OldLayout () {
  const [number, setNumber] = useState('7976892266')
  const [type, setType] = useState('text')
  const [message, setMessage] = useState('Product Quantity Is')
  const [instance_id, setInstance_id] = useState('6540EB2046EC3')
  const [access_token, setAccess_token] = useState('6540eab67acc4')
  const [appendData, setAppendData] = useState('')

  const [name, setName] = useState('')
  const [productName, setProductName] = useState('')
  const [productCode, setProductCode] = useState('')
  const [productQuantity, setProductQuantity] = useState('')
  const [response, setResponse] = useState('')

  const fetchingData = async () => {
    console.log(name)
    console.log('getting into fetching Data Api')
    try {
      let response = await fetch(
        `http://192.168.1.11:3001/dataGet?name=${name}`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json'
          }
        }
      )

      if (response.ok) {
        let data = await response.json()
        console.log('Getting dataFetching is OK')
        console.log('Here is the data:', data.data.quantity)
        let quantity = data.data.quantity
        setAppendData(quantity)
        setResponse(name + "'s Quantity is : " + quantity)
      } else {
        console.log('Error in getting data')
        console.log('Not OK')
        throw new Error('Error in fetching data')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  let mergeMessage = `${message}:${appendData}`
  let apiUrl = `http://192.168.1.11:3001/dataSendApi?number=${number}&type=${type}&message=${encodeURIComponent(
    mergeMessage
  )}&instance_id=${instance_id}&access_token=${access_token}`
  console.log(apiUrl)
  const sendMessageApi = async () => {
    console.log(name)
    console.log('Clicked backend Api')

    try {
      //   let fetchedData=await fetchingData();
      //   console.log(fetchedData)
      //   if (fetchedData.ok) {
      //     const data = await fetchedData.json();
      //     console.log('Data Fetched successfully:', data);
      // } else {
      //     console.log('Error in sending message');
      //     setResponse("Please Enter Product Name");
      // }
      let mergeMessage = `{message}:${appendData}`
      const response = await fetch(
        apiUrl,
        // `http://192.168.1.11:3001/dataSendApi?number=7979892266&type=text&message=hey there is your response what we are sending&instance_id=6540EB2046EC3&access_token=6540eab67acc4`,
        {
          method: 'post',
          headers: {
            'Content-type': 'application/json'
          }
        }
      )
      console.log(response)
      if (response.ok) {
        const data = await response.json()
        console.log('Message sent successfully:', data)
        setResponse('Message Sent Successfully')
      } else {
        console.log('Error in sending message')
        setResponse('Error in sending message')
      }
    } catch (error) {
      console.error('Error:', error)
      setResponse('Error: ' + error.message)
    }
  }

  const createData = async () => {
    console.log('entering createData function')

    try {
      const postData = {
        name: productName,
        code: productCode,
        quantity: productQuantity
      }

      let result = await fetch(`http://192.168.1.11:3001/dataCreate`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(postData)
      })

      if (result.ok) {
        const responseData = await result.json()
        console.log('Data created successfully')
        console.log('Created data:', responseData.message)
        setResponse(responseData.message)
      } else {
        console.log('Error in creating data')
        console.log('not ok')
      }
    } catch (error) {
      console.error('Error occurred while creating data:', error)
    }
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <h1 style={{ color: '#27AE60' }}>
          <i class='fab fa-whatsapp' /> Ai ChatBot WhatsApp
        </h1>
        <div id='firstDiv'>
          <h3>Enter Your Entries Here</h3>

          <input
            type='text'
            name=''
            id='inputBox'
            placeholder='enter productName to create'
            value={productName}
            onChange={event => {
              setProductName(event.target.value)
            }}
          />
          <input
            type='text'
            name=''
            placeholder='enter productCode to create'
            id='inputBox'
            value={productCode}
            onChange={event => {
              setProductCode(event.target.value)
            }}
          />
          <input
            type='text'
            name=''
            id='inputBox'
            placeholder='enter productQuantity to create'
            value={productQuantity}
            onChange={event => {
              setProductQuantity(event.target.value)
            }}
          />
          <button id='buttonStyle' onClick={createData}>
            Create Data
          </button>
        </div>
        <h3>Enter Product Name Here</h3>

        <input
          type='text'
          name=''
          id='inputBox'
          placeholder='enter productName to fetch it'
          value={name}
          onChange={event => {
            setName(event.target.value)
          }}
        />
        <button id='buttonStyle' onClick={sendMessageApi}>
          Send Message
        </button>
        <button id='buttonStyle' onClick={fetchingData}>
          Fetch THE Data From DB
        </button>
        <h1>Get Reponses are here</h1>

        <p>{response}</p>
      </header>
    </div>
  )
}

export default OldLayout
