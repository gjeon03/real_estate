import { motion } from "framer-motion";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import {
	IMarkers,
	IMarkerInfo,
	CustomOverlayDetailAtom,
	SearchResultFlagAtom
} from "../atoms";

const CustomOverlayMarker = styled(motion.div) <{ markerurl: string }>`
	width: 50px;
	height: 50px;
	background-image: url(${(props) => props.markerurl});
		//"https://cdn-icons.flaticon.com/png/512/5695/premium/5695077.png?token=exp=1640874582~hmac=5b1c38465ba47869b7a6af73b7996c3d");
	background-size: 100% 100%;
	cursor: pointer;
`;

const CustomOverlayContent = styled.div`
	width: auto;
	height: 100px;
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
	return (
		<>
			{data.result.map((item) =>
				<CustomOverlayMap
					key={item?.option.id}
					position={{ ...item.option.result.position }}
					yAnchor={yAnchor}
				>
					<CustomOverlayMarker
						variants={markerVariants}
						whileHover="hover"
						onMouseOver={() => onMouseOverMarkerHandler(item.info)}
						onMouseOut={() => onMouseOutMarkerHandler()}
						markerurl={item.option.result.image.src}
					/>
				</CustomOverlayMap>
			)}
			{overlayDetailResult.flag ?
				<CustomOverlayMap
					position={{ lat: +overlayDetailResult.result.y, lng: +overlayDetailResult.result.x }}
					yAnchor={yAnchor + 0.6}
				>
					<CustomOverlayContent>
						{overlayDetailResult.result.place_name ?
							<span>{overlayDetailResult.result.place_name}</span>
							: null}
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