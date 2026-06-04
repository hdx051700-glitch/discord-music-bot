# Discord 音乐机器人

这是一个 Discord.js v14 机器人，支持 slash command、语音频道连接、队列、循环、暂停、继续、跳过、停止等指令。

重要说明：YouTube/网易云可以搜索，但不要用绕过平台限制或版权限制的方式抓取音乐流。当前代码支持播放你有权使用的直链音频，例如 `.mp3/.wav/.ogg/.flac/.m4a/.aac` 链接或你自己的音频服务。YouTube/网易云查询会返回搜索链接，方便确认歌曲。

## 指令

- `/hdxbaba query:歌名或音频链接`
- `/queue`
- `/skip`
- `/pause`
- `/resume`
- `/stop`
- `/loop mode`
- `/shuffle`
- `/volume value`
- `/remove index`
- `/clear`
- `/now`

说明：Discord 官方限制 slash command 名称不能用中文，所以不能注册真正的 `/黄鼎雄是我爸爸`。代码使用 `/hdxbaba`，中文触发语放在命令描述和回复里。

## 环境变量

运行机器人至少需要：

```env
DISCORD_TOKEN=你的机器人令牌
```

如果要重新注册服务器内命令，还需要：

```env
DISCORD_CLIENT_ID=你的 Discord App ID
DISCORD_GUILD_ID=你的服务器 ID
```

## 本地运行

```bash
npm install
cp .env.example .env
npm run deploy:commands
npm start
```

Windows PowerShell 复制环境文件：

```powershell
Copy-Item .env.example .env
```

## Discord 权限

邀请机器人时需要：

- `bot`
- `applications.commands`
- `View Channels`
- `Send Messages`
- `Use Slash Commands`
- `Connect`
- `Speak`

机器人必须加入语音频道后，用户在同一个语音频道里使用播放指令。
