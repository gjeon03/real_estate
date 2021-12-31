import {atom, selector} from "recoil";

export interface ILocation {
	lat: number,
	lng: number,
}

export const locationAtom = atom<ILocation>({
	key: "location",
	default: {
		lat: 37.5665,
		lng: 126.9780,
	}
});

interface ICurrentLocation extends ILocation {
	flag: boolean,
}

export const currentLocationAtom = atom<ICurrentLocation>({
	key: "currentLocation",
	default: {
		flag: false,
		lat: 0,
		lng: 0,
	}
});

export const levelAtom = atom({
	key: "level",
	default: 3,
});

export const mapTypeAtom = atom({
	key: "mapType",
	default: kakao.maps.MapTypeId.ROADMAP,
});

export const mapGetCenter = atom<ILocation>({
	key: "mapGetCenter",
	default: {
		lat: 37.5665,
		lng: 126.9780,
	}
});

export interface ISearchMarkersOption {
	id: number,
	result: {
		position:{
			lat: number,
			lng: number,
		},
		image: {
			src: string,
			size: {
				width: number,
				height: number,
			}
		},
		clickable: boolean,
	}
}

export interface ISearchInfo {
	address_name: string;
	category_group_code: string;
	category_group_name: string;
	category_name: string;
	distance: string;
	id: string;
	phone: string;
	place_name: string;
	place_url: string;
	road_address_name: string;
	x: string;
	y: string;
}

interface ISearchResult {
	option: ISearchMarkersOption,
	info: ISearchInfo,
}

interface ISearchMarkers {
	flag: boolean,
	result: ISearchResult[],
}

export const SearchMarkersAtom = atom<ISearchMarkers>({
	key: "searchMarkers",
	default: {
		flag: false,
		result: [],
	}
});

export const SearchResultFlagAtom = atom({
	key: "searchResult",
	default: false,
});

interface ICustomDetail {
	flag: boolean,
	result: ISearchInfo,
}

export const CustomOverlayDetailAtom = atom<ICustomDetail>({
	key: "customOverlayDetail",
	default: {
		flag: false,
		result: {
			address_name: "",
			category_group_code: "",
			category_group_name: "",
			category_name: "",
			distance: "",
			id: "",
			phone: "",
			place_name: "",
			place_url: "",
			road_address_name: "",
			x: "",
			y: "",
		},
	},
});