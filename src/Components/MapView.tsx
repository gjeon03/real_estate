import React, { useEffect, useState } from "react";
import axios from "axios";
import {
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
	ISearchResults,
	SearchResultAtom,
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
	height: 50px;
	border-bottom: 1px solid #bababa;
	padding: 5px;
	background-color: pink;
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
`;

const SearchBtnSvg = styled(motion.svg)`
	width: 100%;
	color: white;
`;

interface IForm {
	keyword: string;
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
	const [{
		flag: searchMarkerResultFlag,
		result: searchResult
	}, setSearchResult] = useRecoilState(SearchResultAtom);

	useEffect(() => {
		console.log(searchResult);
	}, [searchResult])
	//addressSearch
	const [{
		flag: searchMarkersFlag,
		option: searchMarkersOption,
	}, setSearchMarkers] = useRecoilState(SearchMarkersAtom);

	const places = new kakao.maps.services.Places();
	const callback = (result: ISearchResults[], status: any) => {
		if (status === kakao.maps.services.Status.OK) {
			//console.log(result);
			const { x, y } = result[0];
			setLocation({ lat: +y, lng: +x });
			setLevel(3);
			setSearchMarkers({ flag: false, option: [] });
			setSearchResult({ flag: false, result: [] });
			result.map((data) => {
				setSearchResult(({ result }) => {
					return {
						flag: true,
						result: [
							...result,
							{
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
							}]
					}
				})
				setSearchMarkers(({ option }) => {
					return {
						flag: true,
						option: [
							...option,
							{
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
		const latlng = new kakao.maps.LatLng(lat, lng);
		places.keywordSearch(keyword, callback, {
			location: latlng
		});
	};

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

	//area_code
	// const area_code = require("../area_code/correction.json");
	// console.log(area_code);
	return (
		<>
			<Container>
				<SearchContainer>
					<SearchBox>
						<SearchForm onSubmit={handleSubmit(onValid)}>
							<SearchInput
								{...register("keyword", { required: true, minLength: 2 })}
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
							{searchResult.map((data) =>
								<SearchResultBox>
									<span>{data.address_name}</span>
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
					{searchMarkersFlag ?
						searchMarkersOption.map((data) =>
							<MapMarker key={data.id} {...data.result} />
						)
						: null
					}
				</Map>
			</Container>
		</>
	);
}

export default MapView;