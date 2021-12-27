/// <reference types="react-scripts" />

declare namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: 'development' | 'production' | 'test';
		PUBLIC_URL: string;
		REACT_APP_KAKAO_API_KEY: string;
	}
}

// declare global {
// 	interface Window {
// 		kakao: any;
// 	}
// }