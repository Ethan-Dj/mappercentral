import mapboxgl from 'mapbox-gl';
import ReactMapGL, { Marker, Popup, Source, Layer, fitBounds } from "react-map-gl";
import { useEffect , useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
mapboxgl.accessToken = 'pk.eyJ1IjoiZXRoYW4xMjEiLCJhIjoiY2wzYmV2bW50MGQwbTNpb2lxdm56cGdpNyJ9.-wLLlz-sFhNPiXCyVCQ6kg';

const Map1 = (props) => {
    const location = useLocation()
    const navigate =useNavigate()

    const [viewport, setViewport] = useState({
        latitude: 0,
        longitude: 0,
        zoom: 8
      });


      useEffect(() => {
        if (location.state.fetchedData && location.state.fetchedData.length > 0) {
        let totalLat = 0 
        let totalLong = 0 
        let maxLat = 0 

        location.state.fetchedData.map(item => {
            totalLat = totalLat + Number(item.lat)
            totalLong = totalLong + Number(item.long)
        })
        setViewport({
            latitude: totalLat/location.state.fetchedData.length,
            longitude: totalLong/location.state.fetchedData.length,
            zoom: 8
        })
    }
      }, [location.state]);


  const [lines, setLines] = useState([[0,0]])

  const dataOne = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: lines
    }
  };

  useEffect(()=>{
    if (Array.isArray(location.state.fetchedData)){
        const lines1 = location.state.fetchedData.map(item => [item.long, item.lat])
        setLines(lines1)

        const bounds = new mapboxgl.LngLatBounds();
        location.state.fetchedData.forEach(item => {
          bounds.extend([item.long, item.lat]);
        });
        setViewport(viewport => ({
          ...viewport,
          latitude: bounds.getCenter().lat,
          longitude: bounds.getCenter().lng,
          padding: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
          },
          transitionDuration: 0
        }));
    }
  },[props])


    const CustomMarker = ({ latitude, longitude, index }) => {
        return (
        <Marker key={index} longitude={longitude} latitude={latitude}>
            <div>
            <span style={{backgroundColor: index == location.state.fetchedData.length? "red": (
                        index == 1? "#1ec71e" : "#FF6400"), 
                        border: "none", fontSize:"13px"
                        }}>
                <b style={{color: "white"}}>{index}</b>
            </span>
            </div>
        </Marker>
        );
  };

  const onLoad = (map) => {
    const data = location.state.fetchedData
    console.log(map)
    const bounds = data.reduce(
      (bounds, data) => bounds.extend([data.long, data.lat]),
      new mapboxgl.LngLatBounds()
    );
     map.target.fitBounds(bounds, { padding: 40,duration: 700 })
  };

  return (
    <>
    <div style={{height:"6vh", display:"flex", flexDirection:"row", alignItems:"center"}}>
        <button style={{display:"flex", flexDirection:"column", justifyContent:"center", border: "solid 2px white", marginLeft:"5vw"}} onClick={()=> navigate("/")}>Go back</button>
    </div>
    <div style={{height:"6vh", display:"flex", flexDirection:"row", alignItems:"center", backgroundColor:"#7D7DFF", justifyContent:"space-between"}}>
        <button style={{border:"none", marginLeft:"5vw", height: "30px", fontSize:"16px", borderRadius:"6px"}}>{Array.isArray(location.state.fetchedData) && location.state.fetchedData.length > 0 ? location.state.fetchedData[0].journeyname: null}</button>
        <button style={{border:"none", marginRight:"5vw", height: "30px", borderRadius:"6px"}}><i>{Array.isArray(location.state.fetchedData) && location.state.fetchedData.length > 0 ? `${location.state.fetchedData[0].locationname} - ${location.state.fetchedData[location.state.fetchedData.length-1].locationname}` : null}<u style={{opacity:"0", fontSize:"4px"}}>.-</u></i></button>
    </div>

    <div style={{height:"82vh", width:"100vw"}}>
      <ReactMapGL id="map"
        {...viewport}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxApiAccessToken={mapboxgl.accessToken}
        onMove={evt => setViewport(evt.viewport)}
        onLoad = {onLoad}
      >
    {Array.isArray(location.state.fetchedData) && location.state.fetchedData.length > 0 && (
        location.state.fetchedData.map((item, index) => (
            <CustomMarker latitude={item.lat} longitude={item.long} index={location.state.fetchedData.length - index}
            style={{
                width: "30px", 
                height: "30px", 
                borderRadius: "50%",
                border: "none", 
                transform: "translate(-50%, -50%)",
                }}>
            </CustomMarker>
        ))
    )}

        <Source id="polylineLayer" type="geojson" data={dataOne}>
          <Layer
            id="lineLayer"
            type="line"
            source="my-data"
            layout={{
              "line-join": "round",
              "line-cap": "round"
            }}
            paint={{
              "line-color": "#FF6400",
              "line-width": 8,
              "line-opacity" : 1
            }}
          />
        </Source>
      </ReactMapGL>
    </div>
    <div style={{height:"6vh", display:"flex", flexDirection:"row", alignItems:"center", backgroundColor:"#7D7DFF", justifyContent:"center"}}>
    <button style={{border:"none", marginRight:"5vw", height: "30px", borderRadius:"6px"}}>{Array.isArray(location.state.fetchedData) && location.state.fetchedData.length > 0 ? `${location.state.fetchedData.length} locations` : null}<u style={{opacity:"0", fontSize:"4px"}}>.-</u></button>
        <button style={{border:"none", marginRight:"5vw", height: "30px", borderRadius:"6px"}}><i>{Array.isArray(location.state.fetchedData) && location.state.fetchedData.length > 0 ? `${location.state.fetchedData[0].imgtimedisplay} - ${location.state.fetchedData[location.state.fetchedData.length-1].imgtimedisplay}` : null}<u style={{opacity:"0", fontSize:"4px"}}>.-</u></i></button>
    </div>
    </>
  )
}

export default Map1;