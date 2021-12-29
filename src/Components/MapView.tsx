import React, { useEffect, useState } from "react";
import axios from "axios";
import {
	Map, MapMarker, MapTypeId,
} from "react-kakao-maps-sdk";
import { useQuery } from "react-query";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useRecoilState, useRecoilValue } from "recoil";
import { locationAtom, currentLocationAtom, levelAtom, mapTypeAtom } from "../atoms";
import ToolBox from "./ToolBox";

const Container = styled.div`
	width: 100%;
	height: 100vh;
	position: relative;
`;

function MapView() {
	const [level, setLevel] = useRecoilState(levelAtom);
	const { flag: currentMarkerFlag, lat: currentLat, lng: currentLng } = useRecoilValue(currentLocationAtom);
	const { lat, lng } = useRecoilValue(locationAtom);
	const mapType = useRecoilValue(mapTypeAtom);
	const onZoomChanged = (target: kakao.maps.Map) => {
		const getLevel = target.getLevel();
		if (level === getLevel) return;
		setLevel(getLevel);
	};
	const currentMarkerStyle = {
		position: {
			lat: currentLat,
			lng: currentLng,
		}
	};
	//map object
	const mapobj = {
		center: { lat: lat, lng: lng },
		style: { width: "100%", height: "100vh" },
		level: level,
	};
	// const serviceUrl = "http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcOffiTrade?";
	// const lawdCd = "11110";
	// const dealYmd = "202012";
	// const url = `${serviceUrl}LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}`;
	// const uri = new URL(url);
	// // console.log(url);
	// // console.log(uri);
	// function fetchTotal() {
	// 	return fetch(`${uri}&ServiceKey=${process.env.REACT_APP_OFFICETEL_SALES_PRICE_EN}`, {
	// 		method: "GET",
	// 		mode: "no-cors"
	// 	}).then((response) => response.text())
	// 		.then(str => new window.DOMParser().parseFromString(str, "text/xml"))
	// 		.then(data => console.log(data));;
	// }
	// const data = useQuery("offi", fetchTotal);
	// useEffect(() => {
	// 	console.log(data);
	// }, [data])
	const area_code = require("../area_code/correction.json");
	console.log(area_code);
	// fetch("../../area_code/correction.json")
	// 	.then(response => {
	// 		return response.json();
	// 	})
	// 	.then(jsondata => console.log(jsondata));
	return (
		<>
			<Container>
				<ToolBox />
				<Map {...mapobj} onZoomChanged={onZoomChanged}>
					{mapType && <MapTypeId type={mapType} />}
					{currentMarkerFlag ?
						<MapMarker {...currentMarkerStyle} />
						: null
					}
				</Map>
			</Container>
		</>
	);
}

export default MapView;