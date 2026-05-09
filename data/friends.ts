// 友情链接数据配置
// 用于管理友情链接页面的数据

export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

// 友情链接数据
export const friendsData: FriendItem[] = [
	{
		id: 1,
		title: "雪萌天文台",
		imgurl: "https://img.snowy.moe/head.png",
		desc: "发现巷子里的那颗星星",
		siteurl: "https://blog.snowy.moe/",
		tags: ["朋友们"],
	},
	{
	   id: 2,
	   title: "Watermelonabc的Blog",
       siteurl: "https://watermelonabc.top/",
       imgurl: "https://watermelonabc.top/asset/icon/Avatar.png",
       desc: "IDA，嘿嘿，IDA 🤤",
       tags: ["朋友们"],
	}
];

// 获取所有友情链接数据
export function getFriendsList(): FriendItem[] {
	return friendsData;
}

// 获取随机排序的友情链接数据
export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...friendsData];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
