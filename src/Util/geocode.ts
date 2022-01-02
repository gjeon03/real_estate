import { SetterOrUpdater } from "recoil";
import Geocode from "react-geocode";
import { IMarkers } from "../atoms";

interface IGeocode {
	setMarker: SetterOrUpdater<IMarkers>,
	lat: number,
	lng: number,
	imageUrl: string,
}

export const geocode = async ({lat, lng, imageUrl, setMarker}: IGeocode) => {
	Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);
	Geocode.setLanguage("ko");
	Geocode.setRegion("kr");
	Geocode.enableDebug();

	return await Geocode.fromLatLng(lat + "", lng + "")
		.then(response => {
			const result = response.results[0].formatted_address;
			setMarker({
				flag: true,
				result: [
					{
						option: {
							id: Date.now(),
							result: {
								position: {
									lat,
									lng,
								},
								image: {
									src: `${imageUrl}`,
									size: {
										width: 50,
										height: 50,
									}
								},
								clickable: true,
							}
						},
						info: {
							address_name: result as string | "",
							id: Date.now() + "",
							x: lng + "",
							y: lat + "",
						}
					}
				]
			});
		}).catch(err => console.log(err));
}