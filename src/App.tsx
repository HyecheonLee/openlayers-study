import './App.css'
import "ol/ol.css";

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlTile from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { useEffect, useRef } from 'react';
import { Overlay } from 'ol'
import { DragRotate, Draw } from 'ol/interaction'
import { altKeyOnly, altShiftKeysOnly } from 'ol/events/condition'
import { GeoJSON } from 'ol/format'
import { DrawEvent } from 'ol/interaction/Draw'
import {
  defaults,
  FullScreen,
  OverviewMap,
  ScaleLine,
  ZoomSlider,
  ZoomToExtent
} from 'ol/control'
import MousePosition from 'ol/control/MousePosition'

function App() {
  const overlay = useRef<HTMLParagraphElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    init()
  }, []);


  function init() {
    let fullScreenControl = new FullScreen()
    let mousePositionControl = new MousePosition()

    let overviewMapControl = new OverviewMap({
      collapsed: false,
      layers: [
        new OlTile({
          source: new OSM({
            maxZoom: 20
          }),

        })
      ],
    })

    const scaleLineControl = new ScaleLine()
    const zoomSliderControl = new ZoomSlider()
    const zoomToExtentControl = new ZoomToExtent()

    const map = new OlMap({
      view: new OlView({
        center: [-12080385, 7567433],
        zoom: 3,
        maxZoom: 6,
        minZoom: 2,
        rotation: 0,
      }),
      layers: [
        new OlTile({
          source: new OSM()
        })
      ],
      target: mapRef.current || undefined,
      keyboardEventTarget: document,
      controls: defaults().extend([
        fullScreenControl,
        mousePositionControl,
        overviewMapControl,
        scaleLineControl,
        zoomSliderControl,
        zoomToExtentControl
      ])
    })

    const popup = new Overlay({
      element: overlay.current || undefined,
      positioning: "top-right"
    });

    map.addOverlay((popup));

    map.on('click', event => {
      let clickedCoordinate = event.coordinate
      popup.setPosition(undefined);
      popup.setPosition(clickedCoordinate);
      if (overlay.current) {
        overlay.current.innerHTML = clickedCoordinate.toString();
      }
    });

    const dragRotateInteraction = new DragRotate({
      condition: altKeyOnly
    });

    map.addInteraction(dragRotateInteraction);

    const drawInteraction = new Draw({
      type: "Polygon",
      freehand: true
    })

    map.addInteraction(drawInteraction);

    drawInteraction.on('drawend', (e: DrawEvent) => {

      const parser = new GeoJSON();
      const drawnFeatures = parser.writeFeaturesObject([e.feature]);
      console.log(drawnFeatures.features[0].geometry.coordinates);
    });

  }

  return (
    <div className="App">
      <div id="popup-container">
        <p ref={overlay}/>
      </div>
      <div ref={mapRef} className="map"/>
    </div>
  )
}

export default App
