// 友情链接数据配置
// 远程数据来自 StarGazer114/link-data 仓库的 issue（构建时通过 scripts/sync-friends.js 拉取）
// 远程数据为空或同步失败时，回退到下方 fallbackFriends 本地兜底列表

import remote from "./friends-remote.json";

export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

// 本地兜底数据
const fallbackFriends: FriendItem[] = [
	{
		id: 1,
		title: "雪萌天文台",
		imgurl: "https://img.snowy.moe/head.png",
		desc: "发现巷子里的那颗星星",
		siteurl: "https://blog.snowy.moe/",
		tags: ["朋友们"],
	},
];

interface RemotePayload {
	syncedAt: string | null;
	source: string | null;
	friends: FriendItem[];
}

const remoteData = remote as RemotePayload;

export const friendsData: FriendItem[] =
	remoteData.friends && remoteData.friends.length > 0
		? remoteData.friends
		: fallbackFriends;

export const friendsSource: "remote" | "fallback" =
	remoteData.friends && remoteData.friends.length > 0 ? "remote" : "fallback";

export function getFriendsList(): FriendItem[] {
	return friendsData;
}

export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...friendsData];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
