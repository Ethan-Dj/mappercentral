import mapboxgl, { version } from 'mapbox-gl';
import ReactMapGL, { Marker, Popup, Source, Layer } from "react-map-gl";
import { useEffect , useState } from "react";
mapboxgl.accessToken = 'pk.eyJ1IjoiZXRoYW4xMjEiLCJhIjoiY2wzYmV2bW50MGQwbTNpb2lxdm56cGdpNyJ9.-wLLlz-sFhNPiXCyVCQ6kg';

const Map1 = (props) => {

  const [mount, didMount] = useState(false)

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "33vh",
    latitude: 0,
    longitude: 0,
    zoom: 15,
    dragPan: false,
    scrollZoom: false,
    touchZoom: false,
    doubleClickZoom: false,
    dragRotate: false
  });
  
  useEffect(() => {
    if (props.fetchedData && props.fetchedData.length > 0) {
      setViewport(prevViewport => ({
        ...prevViewport,
        latitude: props.fetchedData[0].lat,
        longitude: props.fetchedData[0].long,
        scrollZoom: false
      }));
    }
  }, [props.fetchedData]);

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
    if (Array.isArray(props.fetchedData)){
        const lines1 = props.fetchedData.map(item => [item.long, item.lat])
        setLines(lines1)
    }
  },[props])

  useEffect(()=>{
    setViewport(prevViewport => ({
      ...prevViewport,
      scrollZoom: false
    }));
  },[props])

    const CustomMarker = ({ latitude, longitude, index }) => {
        return (
        <Marker key={index} longitude={longitude} latitude={latitude}>
            <div>
            <span style={{backgroundColor: props.fetchedData.length - index == 0? "#1ec71e": (
                        props.fetchedData.length - index + 1 == props.fetchedData.length == 0? "#FF6400" : "red"), 
                        border: "none", fontSize:"13px"
                        }}>
                <b>{props.fetchedData.length - index + 1}</b>
            </span>
            </div>
        </Marker>
        );
  };

  useEffect(()=>{
    if (mount == true){
      changeView()
    } else {
      didMount(true)
    }

  }, [props])

  const [mapTest, setMapTest]= useState({})

  const changeView = () => {
    if(Object.keys(mapTest).length !== 0){
      mapTest.flyTo({
      center: [props.fetchedData[props.track[0]].long, props.fetchedData[props.track[0]].lat],
      essential: true,
      duration: 3000,
      zoom:15,
      dragPan: false,
      scrollZoom: false,
      touchZoom: false,
      doubleClickZoom: false,
      dragRotate: false
      });
    }
  }

 
  return (
    <>
      <ReactMapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxApiAccessToken={mapboxgl.accessToken}
        onLoad={(map)=>{
          setMapTest(map.target)
        }}
        onMove={evt => {
          setViewport(evt.viewport)
        }}
        interactive={{
          dragPan: false,
          scrollZoom: false,
          touchZoomRotate: false
        }}
        dragPan={false}
        dragRotate={false}
        touchZoomRotate={false}
        scrollZoom={false}
      >
    {Array.isArray(props.fetchedData) && props.fetchedData.length > 0 && (
        props.fetchedData.map((item, index) => (
            <CustomMarker key={index} latitude={item.lat} longitude={item.long} index={props.fetchedData.length - index}
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
    </>
  )
}

export default Map1;
