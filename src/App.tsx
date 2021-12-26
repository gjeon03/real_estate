import React, { useEffect } from "react";

const { naver } = window;

function App() {
  useEffect(() => {
    let map = null;
    const initMap = () => {
      const map = new naver.maps.Map("map", {
        center: new naver.maps.LatLng(37.511337, 127.012084),
        zoom: 13,
      });
    }
    initMap();
  }, []);
  const mapStyle = {
    width: "80%",
    height: "600px",
  };

  return (
    <React.Fragment>
      <h1>지도</h1>
      <div id="map" style={mapStyle}></div>
    </React.Fragment>
  );
}

export default App;