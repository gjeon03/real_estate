import React, { useEffect, useState } from "react";
import {
	Map,
	CustomOverlayMap,
	MapMarker,
} from "react-kakao-maps-sdk";

interface IPlacesCallBack {
	result: kakao.maps.services.PlacesSearchResultItem[],
	status: kakao.maps.services.Status,
	pagination: kakao.maps.Pagination,
}

function MapView() {
	const [[lat, long], setLocation] = useState([37.5665, 126.9780]);
	const currentLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				setLocation([position.coords.latitude, position.coords.longitude]);
			}, (error) => {
				console.error(error);
			}, {
				enableHighAccuracy: false,
				maximumAge: 0,
				timeout: Infinity
			});
		}
	}
	const mapobj = {
		center: { lat: lat, lng: long },
		style: { width: "100%", height: "100vh" },
		level: 3,
	}
	const mapMarkerobj = {
		position: { lat: lat, lng: long }
	}
	//Nearby facilities
	const [markers, setMarkers] = useState<kakao.maps.services.PlacesSearchResultItem[]>();
	let container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
	let options = { //지도를 생성할 때 필요한 기본 옵션
		center: new window.kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
		level: 3 //지도의 레벨(확대, 축소 정도)
	};
	useEffect(() => {
		const ps = new kakao.maps.services.Places();
		console.log(ps);
		const placesSearchCB = (result: any, status: any, pagination: any) => {
			if (status === kakao.maps.services.Status.OK) {
				var bounds = new kakao.maps.LatLngBounds();
				setMarkers(result)
			}
		}
		ps.keywordSearch("편의점", placesSearchCB);
	}, [])
	console.log(markers);
	return (
		<>
			<h1>지도</h1>
			<button onClick={currentLocation}>현위치</button>
			<Map {...mapobj}>
				<MapMarker {...mapMarkerobj}></MapMarker>
				<CustomOverlayMap position={{ lat: 33.450701, lng: 126.570667 }}>
					<div
						style={{ padding: "42px", backgroundColor: "#fff", color: "#000" }}
					>
						Custom Overlay!
					</div>
				</CustomOverlayMap>
			</Map>
		</>
	);
}

export default React.memo(MapView);