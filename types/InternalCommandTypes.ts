export type categories =
	| "Utils"
	| "Moderation"
	| "Fun"
	| "Owner"
	| "Configuration";
export type cooldownSuggest =
	| `${number}s`
	| `${number}m`
	| `${number}h`
	| `${number}d`;
export type Conditions = "onlyDev" | "premium" | "onlyOwner" | "inDevelopment";

export enum emojiCategories {
	Utils = "🔧",
	Moderation = "👮‍♂️",
	Fun = "🎉",
	Configuration = "⚒️",
	Owner = "🔒",
}
