import { useEffect, useState } from "react";
import { MapMarker } from "react-kakao-maps-sdk";

interface IProps {
	lat: number,
	lng: number
}

function NearbyFacilities({ lat, lng }: IProps) {
	const [markers, setMarkers] = useState<kakao.maps.services.PlacesSearchResultItem[]>();
	useEffect(() => {
		const ps = new kakao.maps.services.Places();
		const placesSearchCB = (result: any, status: any, pagination: any) => {
			if (status === kakao.maps.services.Status.OK) {
				var bounds = new kakao.maps.LatLngBounds();
				setMarkers(result)
			}
		}
		ps.categorySearch("CS2" as kakao.maps.services.CategoryGroupCode, placesSearchCB, {
			location: new kakao.maps.LatLng(lat, lng)
		});
	}, [[lat, lng]]);
	const [locationInfo, setLocationInfo] = useState("");
	const markerClick = (name: string) => {
		setLocationInfo(name);
	};
	return (
		<>
			<span>{locationInfo}</span>
			{markers?.map((data, index) => {
				return (
					<MapMarker
						key={data.id}
						position={{ lat: +data.y, lng: +data.x }}
						onClick={() => markerClick(data.place_name)}
					/>
				);
			})}
		</>
	);
}

export default NearbyFacilities;