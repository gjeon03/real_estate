import axios from "axios";
import { motion } from "framer-motion";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import {
	levelAtom,
	currentLocationAtom,
	locationAtom,
	mapTypeAtom,
	CurrnetMarkersAtom,
} from "../atoms";
import Geocode from "react-geocode";
import { useEffect } from "react";
import userMarkerImage from "../Images/user.png";
import { geocode } from "../Util/geocode";

const ToolBoxs = styled.div`
	width: 45px;
	height: auto;
	position: absolute;
	z-index: 100;
	top: 57px;
	right: 12px;
	display: grid;
	gap: 10px;
`;

const ToolBoxSvg = styled(motion.svg)`
	width: 35px;
	height: 35px;
	background-color: white;
	padding: 7px;
	margin-left: 10px;
	cursor: pointer;
	border: 1px solid #bababa;
`;

const ToolBoxSvgPath = styled(motion.path)`
	display: block;
	width: 100%;
	height: 100%;
`;

const ToolBoxBtn = styled(motion.div)`
	width: 100%;
	height: 35px;
	background-color: white;
	cursor: pointer;
	border: 1px solid #bababa;
	font-size:14px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 400;
`;

const MapLavel = styled.div`
	display:flex;
	flex-direction: column;
`;

const PlusBox = styled(ToolBoxSvg)``;
const MinusBox = styled(ToolBoxSvg)``;
const CurrentLocation = styled(ToolBoxSvg)``;
const MapTypeSelect = styled(motion.select)`
	width: 45px;
	height: 35px;
	background-color: white;
	cursor: pointer;
	border: 1px solid #bababa;
	appearance:none;
	text-align: center;
`;
const MapTypeOption = styled(motion.option)``;

const TypeBtnContainer = styled(motion.div)`
	position: relative;
`;

const TypeBtnBox = styled(motion.div)`
	position: absolute;
	width: 300px;
	height: 35px;
	right: 0;
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	background-color: white;
	font-weight: 400;
	font-size: 14px;
`;

const MapTypeBtn = styled(motion.button)`
	text-align: center;
	border: 1px solid #bababa;
	display: block;
	line-height: 33px;
	background-color: white;
	cursor: pointer;
`;

const currentlocation = {
	normal: {
		fillOpacity: 1,
	},
	active: {
		fillOpacity: [0, 1, 0],
		transition: {
			repeat: Infinity,
		},
	},
};

interface IProps {
	lat: number,
	lng: number,
}

function ToolBox() {
	// zoom
	const [level, setLevel] = useRecoilState(levelAtom);
	const onClickLevelBtn = (num: number) => {
		const result = level + num;
		if (result < 1 || result > 14) return;
		setLevel(result);
	};
	//Currnet Location Marker
	const [{ flag: currentFlag, lat: currentLat, lng: currentLng }, setCurrentLocation] = useRecoilState(currentLocationAtom);
	//Current Location
	const setLocation = useSetRecoilState(locationAtom);
	const currentLocation = async () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				const { coords: { latitude, longitude } } = position;
				setLocation({ lat: latitude, lng: longitude });
				setLevel(3);
				setCurrentLocation({
					flag: true,
					lat: latitude,
					lng: longitude
				});
			}, (error) => {
				console.error(error);
			}, {
				enableHighAccuracy: false,
				maximumAge: 0,
				timeout: Infinity
			});
		}
	}
	//map type change
	const [mapType, setMapType] = useRecoilState(mapTypeAtom);
	const onSelectMapTypeBtn = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const { currentTarget: { value } } = event;
		setMapType(+value);
	};
	//geocode
	const setCurrentMarker = useSetRecoilState(CurrnetMarkersAtom);
	useEffect(() => {
		if (currentFlag) {
			geocode({
				lat: currentLat,
				lng: currentLng,
				imageUrl: userMarkerImage,
				setMarker: setCurrentMarker
			});
		}
	}, [currentLat, currentLng])

	return (
		<ToolBoxs>
			<MapLavel>
				<PlusBox
					onClick={() => onClickLevelBtn(-1)}
					fill="currentColor"
					viewBox="0 0 384 512"
					xmlns="http://www.w3.org/2000/svg"
					variants={currentlocation}
					whileHover="active"
					animate="normal"
				>
					<ToolBoxSvgPath
						d="M376 232H216V72c0-4.42-3.58-8-8-8h-32c-4.42 0-8 3.58-8 8v160H8c-4.42 0-8 3.58-8 8v32c0 4.42 3.58 8 8 8h160v160c0 4.42 3.58 8 8 8h32c4.42 0 8-3.58 8-8V280h160c4.42 0 8-3.58 8-8v-32c0-4.42-3.58-8-8-8z"
					/>
				</PlusBox>
				<MinusBox
					onClick={() => onClickLevelBtn(1)}
					fill="currentColor"
					viewBox="0 0 384 512"
					xmlns="http://www.w3.org/2000/svg"
					variants={currentlocation}
					whileHover="active"
					animate="normal"
				>
					<ToolBoxSvgPath
						d="M376 232H8c-4.42 0-8 3.58-8 8v32c0 4.42 3.58 8 8 8h368c4.42 0 8-3.58 8-8v-32c0-4.42-3.58-8-8-8z"
					/>
				</MinusBox>
			</MapLavel>
			<CurrentLocation
				onClick={currentLocation}
				fill="currentColor"
				viewBox="0 0 512 512"
				xmlns="http://www.w3.org/2000/svg"
				variants={currentlocation}
				whileHover="active"
				animate="normal"
			>
				<ToolBoxSvgPath
					d="M504 240h-56.81C439.48 146.76 365.24 72.52 272 64.81V8c0-4.42-3.58-8-8-8h-16c-4.42 0-8 3.58-8 8v56.81C146.76 72.52 72.52 146.76 64.81 240H8c-4.42 0-8 3.58-8 8v16c0 4.42 3.58 8 8 8h56.81c7.71 93.24 81.95 167.48 175.19 175.19V504c0 4.42 3.58 8 8 8h16c4.42 0 8-3.58 8-8v-56.81c93.24-7.71 167.48-81.95 175.19-175.19H504c4.42 0 8-3.58 8-8v-16c0-4.42-3.58-8-8-8zM256 416c-88.22 0-160-71.78-160-160S167.78 96 256 96s160 71.78 160 160-71.78 160-160 160zm0-256c-53.02 0-96 42.98-96 96s42.98 96 96 96 96-42.98 96-96-42.98-96-96-96zm0 160c-35.29 0-64-28.71-64-64s28.71-64 64-64 64 28.71 64 64-28.71 64-64 64z"
				/>
			</CurrentLocation>
			<MapTypeSelect value={mapType} onChange={(event) => onSelectMapTypeBtn(event as any)}>
				<MapTypeOption value={kakao.maps.MapTypeId.ROADMAP}>지도</MapTypeOption>
				<MapTypeOption value={kakao.maps.MapTypeId.SKYVIEW}>위성</MapTypeOption>
				<MapTypeOption value={kakao.maps.MapTypeId.USE_DISTRICT}>지적</MapTypeOption>
				<MapTypeOption value={kakao.maps.MapTypeId.TERRAIN}>지형</MapTypeOption>
				<MapTypeOption value={kakao.maps.MapTypeId.TRAFFIC}>교통</MapTypeOption>
				<MapTypeOption value={kakao.maps.MapTypeId.BICYCLE}>자전거</MapTypeOption>
			</MapTypeSelect>
		</ToolBoxs>
	);
}

export default ToolBox;