import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { useLocation } from 'react-router-dom';

const UploadNewStart = (props) => {
  const navigate = useNavigate()

  const location1 = useLocation()

  const [id, setId] = useState(location1.state.id)
  const [token, setToken] = useState(location1.state.token)

  const [selectedImage, setSelectedImage] = useState(null)
  const [changeButton, setChangeButton] = useState("Choose Photo/Video")
  const [location, setLocation] = useState({})
  const [imgTime, setImgTime] = useState("")
  const [imgTimeDisplay, setImgTimeDisplay] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const getLocation = (position) => {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'a234d69e68msh0dd62b791a51637p16c7e5jsn4cf39ed5ac8d',
        'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com'
      }
    };
    fetch(`https://trueway-geocoding.p.rapidapi.com/ReverseGeocode?location=${lat}%2C${long}&language=en`, options)
    .then(response => response.json())
    .then(res => {
      let inputArea
      `${res.results[0].area}` === "undefined" ? (
         inputArea = res.results[0].locality
      ) : (
        inputArea = res.results[0].area
      )
      let inputAreaFinal
      `${inputArea}` === "undefined" ? inputAreaFinal = "No-Where" : inputAreaFinal = `${inputArea}, ${res.results[0].country}`
      const locationData = {lat:lat, long:long, name: inputAreaFinal}
      setLocation(locationData)
    })
    .catch(err => console.error(err));
  }

  useEffect(()=> {
      window.navigator.geolocation.getCurrentPosition(getLocation);
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const formattedDateTime = `${[year,month,day,hours,minutes,seconds]}`
      const displayFormattedTime = `${hours}:${minutes}-${day}/${month}/${year-2000}`
      setImgTimeDisplay(displayFormattedTime)
      setImgTime(formattedDateTime)

  },[])

  const display = (e) => {
    const file = e.target.files[0];
    setChangeButton("Change Photo/Video")
    setSelectedImage(file);
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    if (name.length !==0){
    if(!selectedImage) return
    const reader = new FileReader()
    reader.readAsDataURL(selectedImage)
    reader.onload = () => {
      uploadImage(reader.result)
    }}
  }

  const uploadImage = async (base64EncodedImage) => {
    console.log("loading")
    setLoading(true)
    await fetch('/api/upload', {
    method: 'POST',
    body: JSON.stringify({
      data: base64EncodedImage,
      locationName: location.name,
      long: location.long,
      lat: location.lat,
      imgTime: imgTime,
      imgTimeDisplay: imgTimeDisplay,
      journeyName: name,
      userId: id

    }),
    headers: {'Content-type':'application/json'}
    })
    .then(res => {
      setLoading(false)
      navigate("/", {state :{id: id, token: token}})
      console.log(res)

    })
    
  }

  const changeText = (e) => {
    e.preventDefault()
    setName(e.target.value)
  }
  if (loading === false){
  return ( 
    <> 
      <div style={{height:"6vh", display:"flex", flexDirection:"row", alignItems:"center", backgroundColor:"#7D7DFF", justifyContent:"center"}}>
        <button style={{border:"none", height: "30px", fontSize:"16px", borderRadius:"6px"}}>Create New Journey</button>
      </div>  

      
      <form style={{display: "flex", flexDirection:"column", alignItems: "center", marginTop:"20px"}}>
        <label name="journeyName">New Journey Name: {name}</label>
        <input style={{borderRadius:"20px", padding: "2px 10px", marginTop:"2px", width:"140px"}} type="text" name="journeyName" placeholder="Please type here..." maxLength="20" onChange={(e)=>changeText(e)}></input>
      </form>

      <div>
      <form style={{display: "flex", flexDirection:"column", alignItems: "center"}}onSubmit = {(e)=> handleSubmit(e)}>
        <label style={{marginTop:"20px", marginBottom:"22px"}}>
            <input type="file" name="image" onChange={(e) => display(e)} style={{ display: "none" }} />
            <span>{changeButton}</span>
        </label>
        

          <div style={{width:"80vw", height: "80vw", border:"solid 2px white", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden"}}>
          {selectedImage && selectedImage.type.includes("image") && 
            <img style={{ maxWidth: "100%"}} src={`${URL.createObjectURL(selectedImage)}`} alt="Selected" />
          }
          {selectedImage && selectedImage.type.includes("video") && 
            <video autoPlay loop style={{ width: "100%",  objectFit: "cover"}} controls src={`${URL.createObjectURL(selectedImage)}`}/>
          }
        </div>
        
        <input style={{marginTop:"20px", marginBottom:"20px", display:"flex", flexDirection:"column", justifyContent:"center", border: "solid 2px white", height: "30px"}} id="submit" type="submit" value="Upload photo/video and location to journey"/>
        <p style={{fontSize:"12px", margin:"0"}}>Your journey must have a name...</p>
        <p style={{fontSize:"12px", margin:"0"}}>Only upload photos and videos please...</p>
      </form>
      </div>

    </>
    )} else {
      return(
      <>
        <div style={{display:"flex", flexDirection:"column", alignContent:"center", justifyContent:"center", textAlign:"center", alignItems:"center", height:"100vh"}}>
          <h1 style={{animation:"flash 1.5s infinite"}}>Uploading</h1>
          <p>Just give us a sec</p>
        </div>
      </>
      )
    }
  };

export default UploadNewStart