import React, { useEffect, useState } from "react";
import axios from "axios";
import {
	CustomOverlayMap,
	Map, MapMarker, MapTypeId,
} from "react-kakao-maps-sdk";
import { useQuery } from "react-query";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useRecoilState, useRecoilValue } from "recoil";
import {
	locationAtom,
	currentLocationAtom,
	levelAtom,
	mapTypeAtom,
	mapGetCenter,
	SearchMarkersAtom,
	ISearchInfo,
	SearchResultFlagAtom,
	ILocation,
	CustomOverlayDetailAtom,
	ISearchMarkersOption,
} from "../atoms";
import ToolBox from "./ToolBox";
import { useForm } from "react-hook-form";

const Container = styled.div`
	width: 100%;
	height: 100vh;
	position: relative;
`;

const SearchContainer = styled.div`
	width: 300px;
	position: absolute;
	top: 20px;
	left: 20px;
	z-index: 100;
	display:flex;
	flex-direction: column;
`;

const SearchResult = styled.div`
	width: 300px;
	max-height: 400px;
	background-color: white;
	overflow-y: scroll;
`;

const SearchResultBox = styled.div`
	width: 100%;
	height: 70px;
	border-bottom: 1px solid #bababa;
	padding: 10px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	span:nth-child(1){
		font-size: 20px;
		font-weight: 400;
	}
	span:nth-child(2), span:nth-child(3){
		font-size: 13px;
	}
	&:hover {
		background-color:#FA8809;
	}
`;

const CustomOverlayMarker = styled(motion.div)`
	width: 50px;
	height: 50px;
	background-image: url("https://cdn-icons.flaticon.com/png/512/5695/premium/5695077.png?token=exp=1640874582~hmac=5b1c38465ba47869b7a6af73b7996c3d");
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

const SearchBox = styled.div`
	width: 100%;
	padding: 7px;
	border: 1px solid #bababa;
	background-color: white;
`;

const SearchForm = styled.form`
	display: flex;
	justify-content: space-between;
`;

const SearchInput = styled(motion.input)`
	width: 90%;
	border-radius: 5px 0 0 5px;
	border: 1px solid #FA8809;
	padding: 0 10px 0 10px;
`;

const SearchBtn = styled(motion.button)`
	width: 10%;
	padding: 5px;
	background-color: #FA8809;
	border-radius: 0 5px 5px 0;
	border: none;
	outline:none;
	cursor: pointer;
`;

const SearchBtnSvg = styled(motion.svg)`
	width: 100%;
	color: white;
`;

interface IForm {
	keyword: string;
}

const markerVariants = {
	hover: {
		scale: 1.2,
	}
}

function MapView() {
	const [level, setLevel] = useRecoilState(levelAtom);
	const { flag: currentMarkerFlag, lat: currentLat, lng: currentLng } = useRecoilValue(currentLocationAtom);
	const [{ lat, lng }, setLocation] = useRecoilState(locationAtom);
	const mapType = useRecoilValue(mapTypeAtom);
	const [{ lat: getCenterLat, lng: getCenterLng }, setGetCenter] = useRecoilState(mapGetCenter);
	const onZoomChanged = (target: kakao.maps.Map) => {
		const getLevel = target.getLevel();
		if (level === getLevel) return;
		setLevel(getLevel);
	};
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
	//search result list
	const [searchMarkerResultFlag, setSearchResultFlag] = useRecoilState(SearchResultFlagAtom);
	const onClickResultBox = (x: number, y: number) => {
		setLocation({ lat: y, lng: x });
		setGetCenter({ lat: y, lng: x });
	};
	//addressSearch
	const [searchMarker, setSearchMarkers] = useRecoilState(SearchMarkersAtom);

	const places = new kakao.maps.services.Places();
	const callback = (result: ISearchInfo[], status: any) => {
		if (status === kakao.maps.services.Status.OK) {
			const { x, y } = result[0];
			setLocation({ lat: +y, lng: +x });
			setGetCenter({ lat: +y, lng: +x });
			setLevel(3);
			setSearchMarkers({ flag: false, result: [] });
			setSearchResultFlag(false);
			result.map((data) => {
				setSearchResultFlag(true);
				setSearchMarkers(({ result }) => {
					return {
						flag: true,
						result: [...result,
						{
							option: {
								id: +data.id,
								result: {
									position: {
										lat: +data.y,
										lng: +data.x,
									},
									image: {
										src: "https://cdn-icons.flaticon.com/png/512/5695/premium/5695077.png?token=exp=1640874582~hmac=5b1c38465ba47869b7a6af73b7996c3d",
										size: {
											width: 50,
											height: 50,
										}
									},
									clickable: true,
								}
							},
							info: {
								address_name: data.address_name,
								category_group_code: data.category_group_code,
								category_group_name: data.category_group_name,
								category_name: data.category_name,
								distance: data.distance,
								id: data.id,
								phone: data.phone,
								place_name: data.place_name,
								place_url: data.place_url,
								road_address_name: data.road_address_name,
								x: data.x,
								y: data.y,
							}

						}
						]
					}
				})
			})
		}
	};
	const { register, handleSubmit } = useForm<IForm>();
	const onValid = (data: IForm) => {
		const { keyword } = data;
		const latlng = new kakao.maps.LatLng(getCenterLat, getCenterLng);
		places.keywordSearch(keyword, callback, {
			location: latlng
		});
	};

	const searchInputMouseHandler = () => {
		console.log("mouseOn");
		setSearchResultFlag(true);
	};
	//customOverlay detailBox
	const [{ flag: overlayDetailFlag, result: overlayDetailResult }, setOverlayDetail] = useRecoilState(CustomOverlayDetailAtom);

	//Map get center
	const getCenter = (target: kakao.maps.Map) => {
		const centerLocation = target.getCenter();
		setGetCenter({ lat: centerLocation.getLat(), lng: centerLocation.getLng() });
	};
	//map object
	const mapobj = {
		center: { lat: lat, lng: lng },
		style: { width: "100%", height: "100vh" },
		level: level,
	};
	//marker eventlistener
	const onMouseOverMarker = (target: kakao.maps.Marker) => {
		console.log(target);
	}
	const mouseOverMarkerHandler = (info: ISearchInfo) => {
		setOverlayDetail({
			flag: true,
			result: {
				address_name: info.address_name,
				category_group_code: info.category_group_code,
				category_group_name: info.category_group_name,
				category_name: info.category_name,
				distance: info.distance,
				id: info.id,
				phone: info.phone,
				place_name: info.place_name,
				place_url: info.place_url,
				road_address_name: info.road_address_name,
				x: info.x,
				y: info.y,
			}
		})
	};
	const onMouseOutMarkerHandler = () => {
		setOverlayDetail((oldData) => {
			return { flag: false, result: oldData.result }
		});
	}
	return (
		<>
			<Container>
				<SearchContainer>
					<SearchBox>
						<SearchForm onSubmit={handleSubmit(onValid)}>
							<SearchInput
								{...register("keyword", { required: true, minLength: 2 })}
								onMouseDown={searchInputMouseHandler}
								placeholder="Search for address..."
							/>
							<SearchBtn>
								<SearchBtnSvg
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
										clipRule="evenodd"
									></path>
								</SearchBtnSvg>
							</SearchBtn>
						</SearchForm>
					</SearchBox>
					{searchMarkerResultFlag ?
						<SearchResult>
							{searchMarker.result.map((data) =>
								<SearchResultBox key={data.info.id} onClick={() => { onClickResultBox(+data.info.x, +data.info.y) }}>
									<span>{data.info.place_name}</span>
									<span>지번 : {data.info.address_name}</span>
									{data.info.road_address_name ?
										<span>도로명 : {data.info.road_address_name}</span>
										: null}
								</SearchResultBox>
							)}
						</SearchResult>
						: null
					}
				</SearchContainer>
				<ToolBox />
				<Map {...mapobj} onZoomChanged={onZoomChanged} onIdle={getCenter}>
					{mapType && <MapTypeId type={mapType} />}
					{currentMarkerFlag ?
						<MapMarker {...currentMarkerStyle} />
						: null
					}
					{searchMarker.flag ?
						searchMarker.result.map((data) =>
							// <MapMarker
							// 	key={data.id}
							// 	{...data.result}
							// 	onMouseOver={onMouseOverMarker}
							// />
							<CustomOverlayMap
								key={data.option.id}
								position={{ ...data.option.result.position }}
								yAnchor={1}
							>
								<CustomOverlayMarker
									variants={markerVariants}
									whileHover="hover"
									onMouseOver={() => mouseOverMarkerHandler(data.info)}
									onMouseOut={() => onMouseOutMarkerHandler()}
								/>
							</CustomOverlayMap>
						)
						: null
					}
					{
						overlayDetailFlag ?
							<CustomOverlayMap
								position={{ lat: +overlayDetailResult.y, lng: +overlayDetailResult.x }}
								yAnchor={1.6}
							>
								<CustomOverlayContent>
									<span>{overlayDetailResult.place_name}</span>
									<span>지번 : {overlayDetailResult.address_name}</span>
									{overlayDetailResult.road_address_name ?
										<span>도로명 : {overlayDetailResult.road_address_name}</span>
										: null}
								</CustomOverlayContent>
							</CustomOverlayMap>
							: null
					}
				</Map>
			</Container>
		</>
	);
}

export default MapView;