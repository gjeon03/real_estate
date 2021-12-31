/// <reference types="react-scripts" />

declare namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: 'development' | 'production' | 'test';
		PUBLIC_URL: string;
		REACT_APP_KAKAO_MAP_KEY: string;
		REACT_APP_OFFICETEL_SALES_PRICE_EN: string;
		REACT_APP_OFFICETEL_SALES_PRICE_DE: string;
		REACT_APP_GOOGLE_API_KEY: string,
	}
}

// declare global {
// 	interface Window {
// 		kakao: any;
// 	}
// }