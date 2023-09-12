import { LayersControl, ImageOverlay, LayerGroup } from "react-leaflet";
import CountyBorders from "../CountyBorders"
import vegetationImage from "../../data/WHR13_vegetation.png"
import IFire from "../../types/fireType";
import Fire from "../Fire";
import { useState } from "react";
import BurnWindowLegend from "./BurnWindowLegend";
import TemperatureLegend from "./TemperatureLegend";

import Legend from "./Legend";
import TifLayer from "./TifLayer";

export default function MapLayerPickerControl(props: {seed: number, fireData: IFire[], map: any, valueSliderValue: number[], counties: string[], countyRefresh: number}) {
    const [vegetationTypeLegend, setVegetationTypeLegend] = useState(false);
    const [burnWindowLegend, setBurnWindowLegend] = useState(false);
    const [temperatureLegend, setTemperatureLegend] = useState(false);
    const [vegetationCoverLegend, setVegetationCoverLegend] = useState(false);

    // @ts-ignore
    return (
        <LayersControl>
            <LayersControl.Overlay name="Fires">
                <LayerGroup>
                {props.fireData.map((fire, i) => ( <Fire key={i} {...fire} /> ))}
                </LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay name="County Borders">
                <CountyBorders counties={props.counties} countyRefresh={props.countyRefresh}/>
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Vegetation Overlay">
                <LayerGroup eventHandlers={{
                        add: (e) => {setVegetationTypeLegend(true);},
                        remove: (e) => {setVegetationTypeLegend(false);},
                    }}>
                    <ImageOverlay url={vegetationImage} bounds={[[42.040435, -125.354949], [32.506587, -114.352004]]} opacity={props.valueSliderValue[0]} />
                    <Legend map = {props.map} isOn = {vegetationTypeLegend} 
                        colors = {["#cdcdcd", "#ffffff", "#247400", "#abce66", "#ffecbe", "#002474", "#669ace", "#a86f00","#f5ca7b", "#676767", "#beffe8"]}
                        labels = {["Agriculture", "Barren/Other", "Conifer Forest", "Conifer Woodland","Desert", "Hardwood Forest", "Hardwood Woodland", "Herbaceous", "Shrub", "Urban", "Water"]} 
                        legendTitle = {"Vegetation - WHR13 Types"}
                    />
                </LayerGroup>
            </LayersControl.Overlay>

            {(props.seed > 1) ? (
            <LayersControl.Overlay name="Burn Window">
                <LayerGroup eventHandlers={{
                        add: (e) => {setBurnWindowLegend(true);},
                        remove: (e) => {setBurnWindowLegend(false);},
                    }}>
                    {/*Image bounds below work for svg image created by burn-window*/}
                    <ImageOverlay url={`${process.env.REACT_APP_FIRE_WINDOW_BACKEND}/image`} bounds={[[43.375, -127.624903], [31.05, -111.356167]]} opacity={props.valueSliderValue[1]}/>
                    <BurnWindowLegend map = {props.map} isOn = {burnWindowLegend}/>
                </LayerGroup>
            </LayersControl.Overlay>
            ) : 
            (<BurnWindowLegend map = {props.map} isOn = {false}/>)}

            {(props.seed > 1) ? (
            <LayersControl.Overlay name="Average Temperature">
                <LayerGroup eventHandlers={{
                        add: (e) => {setTemperatureLegend(true);},
                        remove: (e) => {setTemperatureLegend(false);},
                    }}>
                    {/*Image bounds below work for svg image created by burn-window*/}
                    <ImageOverlay url={`${process.env.REACT_APP_FIRE_WINDOW_BACKEND}/temperature_image`} bounds={[[43.375, -127.624903], [31.05, -111.356167]]} opacity={props.valueSliderValue[2]}/>
                    <TemperatureLegend map = {props.map} isOn = {temperatureLegend}/>
                </LayerGroup>
            </LayersControl.Overlay>
            ) : 
            (<TemperatureLegend map = {props.map} isOn = {false}/>)}


            <LayersControl.Overlay name="Vegetation Cover">
                <LayerGroup eventHandlers={{
                        add: (e) => {setVegetationCoverLegend(true);},
                        remove: (e) => {setVegetationCoverLegend(false);},
                    }}>
                    <TifLayer url={"EVC.tif"} />
                    <Legend map = {props.map} isOn = {vegetationCoverLegend} 
                        colors = {["#0000FF", "#9EA1EF", "#FF798E", "#BFBFBF", "#E6E8F9", "#A80083", "#FFED77",
                            "#D1FFED", "#797E75"]}
                        labels = {["Open Water", "Snow/Ice", "Developed", "Barren", "Quarries", "NASS-Vineyard",
                            "NASS-Crops", "NASS-Aquaculture", "Sparse Vegetation Canopy"]}
                        legendTitle = {"Vegetation Cover"}
                        multiColor={[["#CCFF99", "#033B01"], ["#D4B17C", "#AC3631"], ["#FFCC66", "#FF3300"]]}
                        multiColorLabels={["Tree 10% - 95%", "Shrub 10% - 79%", "Herb 10% - 99%"]}
                    />
                </LayerGroup>
            </LayersControl.Overlay>
            
        </LayersControl>
    );
}
