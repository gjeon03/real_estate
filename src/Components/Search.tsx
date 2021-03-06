import { motion } from "framer-motion";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { CustomOverlayDetailAtom, IMarkerInfo, levelAtom, locationAtom, SearchMarkersAtom, SearchResultFlagAtom } from "../atoms";
import searchMarkerImage from "../Images/search.png";

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

function Search() {
	const [{ lat, lng }, setLocation] = useRecoilState(locationAtom);
	// const [{ lat: getCenterLat, lng: getCenterLng }, setGetCenter] = useRecoilState(mapGetCenter);
	const setLevel = useSetRecoilState(levelAtom);
	const setOverlayDetail = useSetRecoilState(CustomOverlayDetailAtom);
	//search result list
	const [searchMarkerResultFlag, setSearchResultFlag] = useRecoilState(SearchResultFlagAtom);
	const onClickResultBox = (info: IMarkerInfo) => {
		setLocation({ lat: +info.y, lng: +info.x });
		onMouseOverMarkerHandler(info);
	};
	//addressSearch
	const [searchMarker, setSearchMarkers] = useRecoilState(SearchMarkersAtom);

	const places = new kakao.maps.services.Places();
	const callback = (result: IMarkerInfo[], status: any) => {
		if (status === kakao.maps.services.Status.OK) {
			const { x, y } = result[0];
			setLocation({ lat: +y, lng: +x });
			setLevel(3);
			setSearchMarkers({ flag: false, result: [] });
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
										src: `${searchMarkerImage}`,
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
		const latlng = new kakao.maps.LatLng(lat, lng);
		places.keywordSearch(keyword, callback, {
			location: latlng
		});
	};
	const searchInputMouseHandler = () => {
		setSearchResultFlag(true);
	};
	const onMouseOverMarkerHandler = (info: IMarkerInfo) => {
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
	return (
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
						<SearchResultBox key={data.info.id} onClick={() => { onClickResultBox(data.info) }}>
							<span>{data.info.place_name}</span>
							<span>?????? : {data.info.address_name}</span>
							{data.info.road_address_name ?
								<span>????????? : {data.info.road_address_name}</span>
								: null}
						</SearchResultBox>
					)}
				</SearchResult>
				: null
			}
		</SearchContainer>
	);
}

export default Search;