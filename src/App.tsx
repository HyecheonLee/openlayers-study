import './App.css'
import "ol/ol.css";

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlTile from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { useEffect } from 'react';
import { Overlay } from 'ol'

function App() {
  useEffect(() => {
    init()
  }, []);


  function init() {
    const map = new OlMap({
      view: new OlView({
        center: [-12080385, 7567433],
        zoom: 3,
        maxZoom: 6,
        minZoom: 2,
        rotation: 0.5
      }),
      layers: [
        new OlTile({
          source: new OSM()
        })
      ],
      target: "js-map"
    })
    const popupContainerElement: HTMLElement | null = document.getElementById("popup-coordinates")
    console.log(popupContainerElement);

    const popup = new Overlay({
      element: popupContainerElement || undefined,
      positioning: "top-right"
    });

    map.addOverlay((popup));

    map.on('click', event => {
      let clickedCoordinate = event.coordinate
      popup.setPosition(undefined);
      popup.setPosition(clickedCoordinate);
      if (popupContainerElement != null) {
        popupContainerElement.innerHTML = clickedCoordinate.toString();

      }
    });
  }

  return (
    <div className="App">
      <div id="popup-container">
        <p id="popup-coordinates"></p>
      </div>
      <div id="js-map" className="map"/>
    </div>
  )
}

export default App
