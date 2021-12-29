import {atom, selector} from "recoil";

interface ILocation {
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