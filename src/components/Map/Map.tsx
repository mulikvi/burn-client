import React, { useCallback, useState } from "react";
import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import Fire from "../Fire";
import IFire from "../../types/fireType";
import MapLayerPickerControl from "./MapLayerPickerControl";
import L from "leaflet";
import CustomSliderLayersControl from "./CustomSliderLayersControl";

import "./Map.css";
import Legend from "./VegetationLegend";

export interface MapProps {
    fireData: IFire[];
    setFireData: (fireData: IFire[]) => void;
    seed: number;
}

// Improve performance of using Callback functions
const MemoizedMapLayerPickerControl = React.memo(MapLayerPickerControl);
const MemoizedCustomSliderLayersControl = React.memo(CustomSliderLayersControl);

const Map = (props: MapProps) => {
    const [value1, setValue1] = useState(1);
    const [value2, setValue2] = useState(1);
    
    const [map, setMap] = useState<L.Map>()

    const defaultPosition: LatLngExpression = [36.7783, -119.4179]; // California position

    //    console.log(props.fireData);

    const updateValue1 = useCallback((newValue: number) => {setValue1(newValue); },[] );
    const updateValue2 = useCallback((newValue: number) => {setValue2(newValue); },[] );
    
    return (
        <div className="map__container">           
            <MapContainer
                center={defaultPosition}
                zoom={6}
                style={{ height: "100%" }}
                whenCreated={ (mapInstance) => {setMap(mapInstance)}} //get instance of the map
            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MemoizedMapLayerPickerControl seed={props.seed} fireData={props.fireData} map={map} 
                    valueSliderValue={[value1, value2]} />
                    
                <MemoizedCustomSliderLayersControl seed={props.seed} setValue = {[updateValue1, updateValue2]} map={map} />

            </MapContainer>
        </div>
    );
};

export default Map;