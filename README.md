<div align="center">
<p>
  <img src="http://store-images.s-microsoft.com/image/apps.38737.14049653041316721.afcc08a1-81bb-4df4-aa24-cb7e0fa40a0d.36c559cf-d333-4e78-89a5-e9479407cb22" />
</p>
<a href ="#">
<img src="https://img.shields.io/badge/Discord-ElShyrux-7289DA?style=for-the-badge&logo=Discord" alt="Support" href = "#">
</a>
<a href = "https://www.typescriptlang.org/">
<img src="https://img.shields.io/badge/Made%20with-TypeScript-blue?style=for-the-badge&logo=Typescript" alt= "Lang">
</a>
<a>
<img src="https://img.shields.io/badge/Version-1.10.3-greeen?style=for-the-badge&logo=npm">
</a>
</div>

# 🕙 Pomodoro Bot - Official Docs.
## _Summary_
1. [Introduction](#intro)
2. [How does it work](#works)
3. [How to install](#install)

### Introduction
Pomodoro Bot is a project with the purpose of organize your time and focus better on your tasks.

###  How does it work?
Pomodoro Bot implements a [metodology](https://en.wikipedia.org/wiki/Pomodoro_Technique) comprobed by scientific studies.
In other words, the bot based on cycles of 25 minutes of focus and 5 minutes of relax.

### Installing Pomodoro
To create your own bot based in Pomodoro, first of all, need to clone the project.

```sh
git clone https://github.com/ChirujanoCodding/Pomodoro
cd .\Pomodoro
```

Register on [MongoDB](https://www.mongodb.com/es) and create a cluster (what you want). Once you have all, create a `config.ts` file inside a folder `configuration` should be see like this:

```text
configuration
	L config.ts
commands
	L ...
events
	L ...
...
```

Inside the configuration file, write this

```typescript
import { Config } from "../types/ConfigurationType";

export const Bot_Token: string =
	"Your token bot";

export const configuration: Config = {
	serverId: "your server id",
	testing: true | false , // false push all commands for all servers where the bot is.
	mongoData: {
		username: "Your mongo username",
		password: "Your mongo password",
	},
	devs: ["Your id"],
};

export enum Colors {
	Error = "#eb4034",
	Success = "#6ad966",
	Warning = "#e69627",
	Default = "#4350fa",
	Invisible = "#2f3136",
}
```

Copy and paste this in your terminal
```sh
npm run dev
```
Install al the packages that the console needs pressing `y` and enjoy your bot!
