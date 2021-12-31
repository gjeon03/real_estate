import React, { useEffect, useState } from "react";
import axios from "axios";
import {
	CustomOverlayMap,
	Map, MapMarker, MapTypeId,
} from "react-kakao-maps-sdk";
import { useQuery } from "react-query";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	locationAtom,
	currentLocationAtom,
	levelAtom,
	mapTypeAtom,
	SearchMarkersAtom,
	IMarkerInfo,
	SearchResultFlagAtom,
	ILocation,
	CustomOverlayDetailAtom,
	IMarkersOption,
	CurrnetMarkersAtom,
} from "../atoms";
import ToolBox from "./ToolBox";
import { useForm } from "react-hook-form";
import CustomMarker from "./CustomMarker";
import Search from "./Search";

const Container = styled.div`
	width: 100%;
	height: 100vh;
	position: relative;
`;

function MapView() {
	//map Level
	const [level, setLevel] = useRecoilState(levelAtom);
	//map current marker info
	const { flag: currentMarkerFlag, lat: currentLat, lng: currentLng } = useRecoilValue(currentLocationAtom);
	//map location position
	const [{ lat, lng }, setLocation] = useRecoilState(locationAtom);
	//map type
	const mapType = useRecoilValue(mapTypeAtom);
	//map center position
	const getCenter = (target: kakao.maps.Map) => {
		const centerLocation = target.getCenter();
		setLocation({ lat: centerLocation.getLat(), lng: centerLocation.getLng() });
	};
	//search list flag
	const setSearchResultFlag = useSetRecoilState(SearchResultFlagAtom);
	//level change
	const onZoomChanged = (target: kakao.maps.Map) => {
		const getLevel = target.getLevel();
		if (level === getLevel) return;
		setLevel(getLevel);
	};
	//addressSearch marker
	const searchMarker = useRecoilValue(SearchMarkersAtom);
	//customOverlay detailBox
	const setOverlayDetail = useSetRecoilState(CustomOverlayDetailAtom);
	//map option
	const mapOption = {
		center: { lat: lat, lng: lng },
		style: { width: "100%", height: "100vh" },
		level: level,
	};
	const onMouseOutMarkerHandler = () => {
		setOverlayDetail((oldData) => {
			return { flag: false, result: oldData.result }
		});
		setSearchResultFlag(false);
	};
	//current info
	const currentMarker = useRecoilValue(CurrnetMarkersAtom);
	const currentMarkerStyle = {
		position: {
			lat: currentLat,
			lng: currentLng,
		},
		image: {
			src: "https://cdn-icons-png.flaticon.com/512/4151/4151073.png",
			size: {
				width: 50,
				height: 50
			}
		}
	};
	return (
		<>
			<Container>
				<ToolBox />
				<Search />
				<Map
					{...mapOption}
					onZoomChanged={onZoomChanged}
					onIdle={getCenter}
					onDragStart={onMouseOutMarkerHandler}
				>
					{mapType && <MapTypeId type={mapType} />}
					{/* {currentMarkerFlag ?
						<MapMarker {...currentMarkerStyle} />
						: null
					} */}
					{searchMarker.flag ?
						<CustomMarker
							data={searchMarker}
							yAnchor={1}
						/>
						: null}
					{currentMarker.flag ?
						<CustomMarker
							data={currentMarker}
							yAnchor={1}
						/>
						: null}
				</Map>
			</Container>
		</>
	);
}

export default MapView;