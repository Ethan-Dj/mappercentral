import { useEffect } from "react"
import { useState, useRef } from "react";
import Map1 from "./Map"
import { Map } from "mapbox-gl";
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom";
import createScrollSnap from 'scroll-snap'

const Home = (props) => {
    const location = useLocation()

    useEffect(()=>{
        if (localStorage.length == 0){
            navigate("/login")
        } 
    },[])

    const navigate = useNavigate()

    const [fetchedData, setFetchedData]=useState({})
    const [loaded, setLoaded]=useState(false)
    const [track, setTrack] = useState([])
    const [isImage, setIsImage] = useState([]) // true if image false if not
    const [muted, setMuted] = useState(true);
    const [seperated, setSeperated] = useState([])

    useEffect(()=>{setMuted(true)},[track])

    useEffect(() => {
        if (localStorage.length == 0){
            navigate("/login")
        } else {
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'token': JSON.parse(localStorage.getItem("data"))[1],
            'id': JSON.parse(localStorage.getItem("data"))[0]
          }
        };
      
        fetch('/api/images', options)
          .then(response => response.json())
          .then(data => {
            console.log(data)
            if (data[0]=="empty"){
                navigate("/login")
            } else {
                if (localStorage.length == 0){
                    navigate("/login")
                }
                if (data.length == 0){
                    navigate("/uploadnewstart", {state :{id: JSON.parse(localStorage.getItem("data"))[0]}})
                } else {
                const reversed = data.reverse()
                setFetchedData(reversed)
                setLoaded(true)
                }
            }
            
          })
          .catch(error => console.error(error));
      }}, []);

    useEffect(()=>{
        if (Object.keys(fetchedData).length !== 0 && loaded == true){
            let seperatedJourneys = []
            fetchedData.map((item, index)=>{
                if (index === 0){
                    let array = [item]
                    seperatedJourneys.push(array)
                } else if (item.journeyname ==  seperatedJourneys[seperatedJourneys.length-1][0].journeyname){
                    seperatedJourneys[seperatedJourneys.length-1].push(item)
                }
                 else {
                    let array = [item]
                    seperatedJourneys.push(array)
                }
            })
        let ordered = []
        seperatedJourneys.map(item => {
            ordered.push(item.reverse())
        })
        setSeperated(ordered)
        }
    },[fetchedData])

    useEffect(()=>{
        let emptyArr = []
        if (seperated.length !== 0){
            seperated.forEach(item => {
                emptyArr.push([0,item.length])
            })
            setTrack(emptyArr)
        }
    },[seperated])

    useEffect(()=> {
        let type = []
        if (track.length !== 0){
            seperated.forEach((item, index)=>{
                if (seperated[index][track[index][0]].url.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv)$/) != null) {
                    type.push(false)
                } else {
                    type.push(true)
                    // setIsImage(true)
                    // console.log(`${fetchedData[track.empty].url}`)
            }})
            setIsImage(type)
            } 
    },[track])

    const goForward = (index) => {
        let data = {...track}
        if (data[index][0]+1 !== data[index][1] ){
            data[index][0] ++ 
            setTrack(data)
        } else {
            data[index][0] = 0 
            setTrack(data)
        }
    }

    const goBack = (index) => {
        let data = {...track}
        if (data[index][0] !== 0){
            data[index][0] --
            setTrack(data)
        } else {
            data[index][0] = data[index][1]-1
            setTrack(data)
        }
    }

    function handleToggleMute() {
        setMuted(!muted);
      }

    ////https://css-tricks.com/practical-css-scroll-snapping/

    return(
        <div className="fuck"
        style={{
            scrollSnapType: "y mandatory",
            overflow:"scroll",
            height:"95vh",
            scrollSnapAlign:"start 50%",
            scrollSnapAlign:"end 50%",
          }}>
        {loaded == true? (
                <div style ={{backgroundColor:"#1012FA" ,width: "100vw", zIndex:"3",position: "fixed", bottom:"0", height:"5vh", display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-around"}}>
                    <button style={{ marginRight:"5vw", height: "30px", border: "solid 2px white", display: fetchedData.length === 0 ? "none" : "block" }} onClick={() => navigate("/upload", { state: { name: fetchedData[0].journeyname } })}>Add step to {fetchedData[0].journeyname}</button>
                    <button style={{ marginRight:"5vw", height: "30px", border: "solid 2px white"}} onClick={() => navigate("/uploadnew")}>New Journey</button>
                    <button style={{ marginRight:"5vw", height: "30px", border: "solid 2px white"}} onClick={() =>{
                        localStorage.clear();
                        navigate("/login")
                    } }>Log Out</button>
                </div>
            
        ):(
            console.log("loading")
        )}
        
        <div>
        {seperated.length == 0 ? console.log("") : (
            seperated.map((item, index) => {
                // let type = true 
                return isImage[index] === true ? (
                    <div className="child" style = {{scrollSnapAlign: "start", scrollSnapDestination:"0% 10%"}}>
                    <div key={index} style={{width:"100vw", height:"62vh", border:"none", 
                            backgroundImage: `url('${track.length == 0 ? null : seperated[index][track[index][0]].url}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            }}>
                        <div style={{display:"flex", flexDirection: "row", justifyContent:"space-between", height: "8vh", alignItems: "center"}}>
                            <button style={{border:"none", marginLeft:"5vw", height: "30px", fontSize:"16px", borderRadius:"6px"}}>{track.length == 0 ? null : seperated[index][track[index][0]].journeyname}</button>
                            <button style={{border:"none", marginRight:"5vw", height: "30px", borderRadius:"6px"}}><i>{track.length == 0 ? null : seperated[index][track[index][0]].imgtimedisplay.replace(/\-/g, " ")}<u style={{opacity:"0", fontSize:"4px"}}>.-</u></i></button>
                        </div>
                        <button onClick={()=> goBack(index)} style ={{opacity: "0", width:"45vw", marginRight:"5vw", marginTop:"0vw", height:"44vh"}}>Left</button>
                        <button onClick={()=> goForward(index)}style={{opacity: "0", width:"45vw", marginLeft:"5vw", marginTop:"0vw", height:"44vh"}}>Right</button>
                        <div style={{display:"flex", flexDirection: "row", justifyContent:"space-between", height: "8vh", alignItems: "center"}}>
                            <button style={{opacity: "0", border:"#1012FA 1px solid", marginLeft:"5vw", height: "30px", borderRadius:"6px"}}><i>{track.length == 0 ? null : seperated[index][track[index][0]].imgtimedisplay.replace(/\-/g, " ")}<u style={{opacity:"0", fontSize:"4px"}}>.-</u></i></button>
                            <button style={{ opacity: "0", marginRight:"5vw", height: "30px", border: "solid 2px white"}}>View Journey Map</button>
                        </div>
                    </div>
                    <div style={{position: "relative", width:"100vw", height:"33vh", borderTop:"2px white solid"}}>
                        <Map1 track={track.length == 0 ? null : track[index]} fetchedData={seperated.length == 0 ? null : seperated[index]} />
                        <div style={{position: "absolute", top: 0, left: 0, zIndex: 1}}>
                        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", height: "8vh", alignItems: "center", width: "100%"}}>
                            <button style={{border:"#1012FA 1px solid", marginLeft:"5vw", height: "30px", borderRadius:"6px"}}><i>{track.length == 0 ? null : seperated[index][track[index][0]].locationname}<u style={{opacity:"0", fontSize:"4px"}}>.-</u></i></button>
                            <button style={{marginRight:"5vw", height: "30px", border: "solid 2px white"}} onClick={()=> navigate("/largemap", {state: {fetchedData: seperated[index].reverse(), current: "empty"}})}>View Journey Map</button>
                        </div>
                        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", height: "8vh", alignItems: "center", width: "100%"}}>
                            <button onClick={()=> goBack(index)} style ={{opacity: "0", width:"45vw", marginRight:"5vw", marginTop:"10vh", height:"20vh"}}>Left</button>
                            <button onClick={()=> goForward(index)}style={{opacity: "0", width:"45vw", marginLeft:"5vw", marginTop:"10vh", height:"20vh"}}>Right</button>
                        </div>
                        </div>
                    </div>
                    <div style={{height:"0vh"}}></div>
                    </div>
                    
                    ) : (
                        <div className="child" style = {{scrollSnapAlign: "start", scrollSnapDestination:"0% 10%"}}>
                        <div key = {index} style={{width:"100vw", height:"62vh", border:"none", position: "relative"}}>
                        <video autoPlay loop muted={muted} style={{ width: "100%",  objectFit: "cover"}} controls src={`${track.length == 0 ? null : seperated[index][track[index][0]].url}`}/>
                        <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "1"}}>
                        <div style={{display:"flex", flexDirection: "row", justifyContent:"space-between", height: "8vh", alignItems: "center"}}>
                            <button style={{border:"none", marginLeft:"5vw", height: "30px", fontSize:"16px", borderRadius:"6px"}}>{track.length == 0 ? null : seperated[index][track[index][0]].journeyname}</button>
                            <button style={{border:"none", marginRight:"5vw", height: "30px", borderRadius:"6px"}}><i>{track.length == 0 ? null : seperated[index][track[index][0]].imgtimedisplay.replace(/\-/g, " ")}<u style={{opacity:"0", fontSize:"4px"}}>.-</u></i></button>
                        </div>
                        <button onClick={()=> goBack(index)} style ={{opacity: "0", width:"45vw", marginRight:"5vw", marginTop:"0vw", height:"44vh"}}>Left</button>
                        <button onClick={()=> goForward(index)}style={{opacity: "0", width:"45vw", marginLeft:"5vw", marginTop:"0vw", height:"44vh"}}>Right</button>
                        <div style={{display:"flex", flexDirection: "row", justifyContent:"space-between", height: "8vh", alignItems: "center"}}>
                            <button style={{opacity: "0", border:"#1012FA 1px solid", marginLeft:"5vw", height: "30px", borderRadius:"6px"}}><i>{track.length == 0 ? null : seperated[index][track[index][0]].imgtimedisplay.replace(/\-/g, " ")}<u style={{opacity:"0", fontSize:"4px"}}>.-</u></i></button>
                            <button style={{height: "30px", border: "none", backgroundColor: "transparent", display:muted ? "block" : "none" }} onClick={handleToggleMute}>Unmute</button>
                            <button style={{ opacity: "0", marginRight:"5vw", height: "30px", border: "solid 2px white"}} >View Journey Map</button>
                        </div>
                        </div>
                    </div>
                    <div style={{position: "relative", width:"100vw", height:"33vh", borderTop:"2px white solid"}}>
                        <Map1 track={track.length == 0 ? null : track[index]} fetchedData={seperated.length == 0 ? null : seperated[index]} />
                        <div style={{position: "absolute", top: 0, left: 0, zIndex: 1}}>
                        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", height: "8vh", alignItems: "center", width: "100%"}}>
                            <button style={{border:"#1012FA 1px solid", marginLeft:"5vw", height: "30px", borderRadius:"6px"}}><i>{track.length == 0 ? null : seperated[index][track[index][0]].locationname}<u style={{opacity:"0", fontSize:"4px"}}>.-</u></i></button>
                            <button style={{marginRight:"5vw", height: "30px", border: "solid 2px white"}} onClick={()=> navigate("/largemap", {state: {fetchedData: seperated[index].reverse(), current: "empty"}})}>View Journey Map</button>
                        </div>
                        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", height: "8vh", alignItems: "center", width: "100%"}}>
                            <button onClick={()=> goBack(index)} style ={{opacity: "0", width:"45vw", marginRight:"5vw", marginTop:"10vh", height:"20vh"}}>Left</button>
                            <button onClick={()=> goForward(index)}style={{opacity: "0", width:"45vw", marginLeft:"5vw", marginTop:"10vh", height:"20vh"}}>Right</button>
                        </div>
                        </div>
                    </div>
                    <div style={{height:"0vh"}}></div>
                    </div>
                    )
                    
            })
        )}
        </div>
        </div>
    )
}

export default Home
