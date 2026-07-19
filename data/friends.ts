// 友情链接数据配置
// ⚠️ 此文件由 GitHub Actions 自动生成，请勿手动修改
// 数据来源：https://github.com/StarGazer114/firends-data

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
		id: 4,
		title: "里世界",
		imgurl: "https://leenet.xyz/avatar.png",
		desc: "Welcome To The World Of Lee",
		siteurl: "https://leenet.xyz",
		tags: ["朋友们"],
	},
	{
		id: 3,
		title: "Watermelonabc的Blog",
		imgurl: "https://watermelonabc.top/asset/icon/Avatar.png",
		desc: "IDA，嘿嘿，IDA 🤤",
		siteurl: "https://watermelonabc.top/",
		tags: ["朋友们"],
	},
	{
		id: 2,
		title: "雪萌天文台",
		imgurl: "https://img.snowy.moe/head.png",
		desc: "发现巷子里的那颗星星",
		siteurl: "https://blog.snowy.moe/",
		tags: ["朋友们"],
	},
	{
		id: 1,
		title: "这是一个测试友链",
		imgurl: "https://imgbed.bear556.top/file/1777777243020_avatar.webp",
		desc: "如果你能看到这个链接，说明我的新友链系统测试成功了",
		siteurl: "https://blog.bear556.top",
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
