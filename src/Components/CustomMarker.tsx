import { motion } from "framer-motion";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import {
	IMarkers,
	IMarkerInfo,
	CustomOverlayDetailAtom,
	SearchResultFlagAtom,
	ClickMapMarkerAtom
} from "../atoms";
import { geocode } from "../Util/geocode";
import checkMarkerImage from "../Images/location.png";

const CustomOverlayMarker = styled(motion.div) <{ markerurl: string }>`
	width: 50px;
	height: 50px;
	background-image: url(${(props) => props.markerurl});
	background-size: 100% 100%;
	cursor: pointer;
	display: block;
`;

const CustomOverlayContent = styled.div`
	width: auto;
	height: 70px;
	background-color: white;
	border: 2px solid #FA8809;
	border-radius: 20px;
	padding: 10px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	span:nth-child(1) {
		font-size: 20px;
		font-weight: 400;
	}
	span:nth-child(2), span:nth-child(3) {
		font-size: 15px;
	}
`;

interface IProps {
	data: IMarkers,
	yAnchor: number,
}

const markerVariants = {
	hover: {
		scale: 1.2,
	}
}

function CustomMarker({ data, yAnchor }: IProps) {
	const [overlayDetailResult, setOverlayDetail] = useRecoilState(CustomOverlayDetailAtom);
	const setSearchResultFlag = useSetRecoilState(SearchResultFlagAtom);
	const onMouseOverMarkerHandler = (info: IMarkerInfo) => {
		setOverlayDetail({
			flag: true,
			result: {
				address_name: info.address_name,
				id: info.id,
				place_name: info.place_name,
				place_url: info.place_url,
				road_address_name: info.road_address_name,
				x: info.x,
				y: info.y,
			}
		});
	};
	const onMouseOutMarkerHandler = () => {
		setOverlayDetail((oldData) => {
			return { flag: false, result: oldData.result }
		});
		setSearchResultFlag(false);
	}
	//custom overlay drag
	let startX: number;
	let startY: number;
	let startOverlayPoint: kakao.maps.Point | any;
	let clickCustomProj: kakao.maps.MapProjection | undefined;
	let clickCustomOverlay: kakao.maps.CustomOverlay;
	const MarkerDraggHandler = (customOverlay: kakao.maps.CustomOverlay) => {
		clickCustomProj = customOverlay.getMap()?.getProjection();
		clickCustomOverlay = customOverlay;
	};
	const onMouseDownHandler = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		kakao.maps.event.preventMap();
		const overlayPos = clickCustomOverlay.getPosition();
		startX = event.clientX;
		startY = event.clientY;
		startOverlayPoint = clickCustomProj?.containerPointFromCoords(overlayPos);
		event.currentTarget.addEventListener('mousemove', onMouseMove);
		setOverlayDetail({
			flag: false,
			result: {
				address_name: "",
				id: "",
				x: "",
				y: "",
			}
		});
	};
	const setClickMarker = useSetRecoilState(ClickMapMarkerAtom);
	const onMouseMove = (event: any) => {
		event.preventDefault();
		const deltaX = startX - event.clientX;
		const deltaY = startY - event.clientY;
		// mousedown됐을 때의 커스텀 오버레이의 좌표에 실제로 마우스가 이동된 픽셀좌표를 반영합니다 
		const newPoint = new kakao.maps.Point(startOverlayPoint.x - deltaX, startOverlayPoint.y - deltaY);
		// 계산된 픽셀 좌표를 지도 컨테이너에 해당하는 지도 좌표로 변경합니다 
		// const s = kakao.maps.Map;
		const newPos = clickCustomProj?.coordsFromContainerPoint(newPoint);
		// 커스텀 오버레이의 좌표를 설정합니다 
		clickCustomOverlay.setPosition(newPos as kakao.maps.LatLng);
	}
	const onMouseUpHandler = (event: React.MouseEvent<HTMLDivElement>) => {
		// 등록된 mousemove 이벤트 핸들러를 제거합니다 
		geocode({
			lat: clickCustomOverlay.getPosition().getLat(),
			lng: clickCustomOverlay.getPosition().getLng(),
			imageUrl: checkMarkerImage,
			setMarker: setClickMarker,
		});
		event.currentTarget.removeEventListener('mousemove', onMouseMove);
	}
	return (
		<>
			{data.result.map((item) =>
				<CustomOverlayMap
					key={item?.option.id}
					position={{ ...item.option.result.position }}
					yAnchor={yAnchor}
					onCreate={MarkerDraggHandler}
				>
					<CustomOverlayMarker
						variants={markerVariants}
						whileHover="hover"
						onMouseOver={() => onMouseOverMarkerHandler(item.info)}
						onMouseOut={() => onMouseOutMarkerHandler()}
						markerurl={item.option.result.image.src}
						onMouseDown={onMouseDownHandler}
						onMouseUp={onMouseUpHandler}
					/>
				</CustomOverlayMap>
			)}
			{overlayDetailResult.flag ?
				<CustomOverlayMap
					position={{ lat: +overlayDetailResult.result.y, lng: +overlayDetailResult.result.x }}
					yAnchor={yAnchor + 0.9}
				>
					<CustomOverlayContent>
						{overlayDetailResult.result.place_name ?
							<span>{overlayDetailResult.result.place_name}</span>
							: <span></span>}
						<span>지번 : {overlayDetailResult.result.address_name}</span>
						{overlayDetailResult.result.road_address_name ?
							<span>도로명 : {overlayDetailResult.result.road_address_name}</span>
							: null}
					</CustomOverlayContent>
				</CustomOverlayMap>
				: null}
		</>
	);
}

export default CustomMarker;