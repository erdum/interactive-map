import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";
import * as turf from "@turf/turf";

const excludedCountriesISOCodes = [
  "ATA",
];

const data = {
  PAK: {
    color: "green"
  }
};

function App() {
  const calculateArea = (geo) => {
    const feature = turf.featureCollection([geo]);
    const area = turf.area(feature);
    return area;
  };

  const getLabelSize = (area) => {
    return Math.max(2, (area / 100000000000) * 0.1);
  };

  const handleMouseEnter = (code, data) => {
    console.log(code, data);
  };

  const handleMouseLeave = (code) => {};

  return (
    <div className="bg-gray-200 w-3/4 rounded mx-auto mt-20">
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 140 }}>
        <Geographies geography="/countries-110m.json">
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geo.properties.NAME;
              const code = geo.properties.ISO_A3_EH;

              if (excludedCountriesISOCodes.includes(code)) return null;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={data[code]?.color ?? undefined}
                  onMouseEnter={() => handleMouseEnter(code, geo)}
                  onMouseLeave={() => handleMouseLeave(code)}
                />
              );
            })
          }
        </Geographies>
        <Geographies geography="/countries-110m.json">
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geo.properties.NAME;
              const code = geo.properties.ISO_A3_EH;
              const area = calculateArea(geo);
              const labelSize = getLabelSize(area);
              const labelX = geo.properties.LABEL_X;
              const labelY = geo.properties.LABEL_Y;

              if (excludedCountriesISOCodes.includes(code)) return null;

              return (
                <Marker coordinates={[labelX, labelY]} fill="yellow">
                  <text
                    textAnchor="middle"
                    style={{ fontSize: `${labelSize}px`, fill: 'yellow' }}
                  >
                    {name}
                  </text>
                </Marker>
              );
            })
          }
        </Geographies>
    </ComposableMap>
    </div>
  );
}

export default App;
