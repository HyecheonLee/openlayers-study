import './App.css'
import "ol/ol.css";

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlTile from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { useEffect, useRef } from 'react';
import { Group } from 'ol/layer'
import { Tile } from 'ol'

function App() {
  const overlay = useRef<HTMLParagraphElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    init()
  }, []);


  function init() {
    const map = new OlMap({
      view: new OlView({
        center: [14146577.196213575, 4514003.151265755],
        zoom: 13,
        extent: [13903350.6805021, 4059443.273146776, 14458599.200649295, 4667156.220394493]

      }),
      layers: [
        new OlTile({
          source: new OSM(),
          zIndex: 1,
          visible: true,
          extent: [13903350.6805021, 4059443.273146776, 14458599.200649295, 4667156.220394493],
          opacity: 0.5
        })
      ],
      target: mapRef.current || undefined
    })
    const layerGroup = new Group({
      layers: [
        new OlTile({
          source: new OSM({
            url: "https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          }),
          zIndex: 0,
          visible: false,
          opacity: 0.1
        })
      ]
    })
    map.addLayer(layerGroup);
    map.on('click', (e) => {
      console.log(e.coordinate);
    })
  }

  return (
    <div className="App">
      <div id="popup-container">
        <p style={{margin: 0, padding: 0}} ref={overlay}/>
      </div>
      <div ref={mapRef} className="map"/>
    </div>
  )
}

export default App
