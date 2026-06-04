import { Client, GatewayIntentBits } from "discord.js";
import { assertConfig, config } from "./config.js";
import { buildSearchResult, isDirectAudioUrl } from "./services/search.js";
import { getPlayer } from "./services/player.js";

assertConfig(["token"]);

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    const player = getPlayer(interaction.guildId);

    if (interaction.commandName === "hdxbaba") {
      const query = interaction.options.getString("query", true);
      const member = await interaction.guild.members.fetch(interaction.user.id);
      const voiceChannel = member.voice.channel;

      if (!voiceChannel) {
        await interaction.reply("你要先进入一个语音频道，我才能进去播放。");
        return;
      }

      await player.connect(voiceChannel);

      if (isDirectAudioUrl(query)) {
        await player.enqueue({
          title: query.split("/").pop(),
          url: query,
          requestedBy: interaction.user.username
        });
        await interaction.reply(`已加入队列：${query}`);
        return;
      }

      const result = buildSearchResult(query);
      await interaction.reply(
        [
          "我找到了搜索入口，但不会绕过平台限制抓取版权音频流。",
          `YouTube：${result.youtube}`,
          `网易云：${result.netease}`,
          "如果你有可播放的 .mp3/.wav/.ogg/.flac 直链，可以直接用 /hdxbaba 链接 播放。"
        ].join("\n")
      );
      return;
    }

    if (interaction.commandName === "queue") {
      const lines = player.queue.map((track, index) => `${index + 1}. ${track.title}`);
      await interaction.reply(
        [`正在播放：${player.current?.title ?? "没有"}`, lines.length ? lines.join("\n") : "队列为空"].join("\n")
      );
      return;
    }

    if (interaction.commandName === "now") {
      await interaction.reply(player.current ? `正在播放：${player.current.title}` : "现在没有播放。");
      return;
    }

    if (interaction.commandName === "skip") {
      player.skip();
      await interaction.reply("已跳过。");
      return;
    }

    if (interaction.commandName === "pause") {
      await interaction.reply(player.pause() ? "已暂停。" : "现在暂停不了。");
      return;
    }

    if (interaction.commandName === "resume") {
      await interaction.reply(player.resume() ? "继续播放。" : "现在继续不了。");
      return;
    }

    if (interaction.commandName === "stop") {
      player.stop();
      await interaction.reply("已停止并离开语音频道。");
      return;
    }

    if (interaction.commandName === "loop") {
      const mode = interaction.options.getString("mode", true);
      player.setLoop(mode);
      const label = { off: "关闭", track: "单曲循环", queue: "队列循环" }[mode];
      await interaction.reply(`循环模式：${label}`);
      return;
    }

    if (interaction.commandName === "shuffle") {
      player.shuffle();
      await interaction.reply("已打乱队列。");
      return;
    }

    if (interaction.commandName === "volume") {
      const volume = interaction.options.getInteger("value", true);
      player.setVolume(volume);
      await interaction.reply(`音量已设为 ${volume}。下一首开始生效。`);
      return;
    }

    if (interaction.commandName === "remove") {
      const index = interaction.options.getInteger("index", true) - 1;
      const removed = player.remove(index);
      await interaction.reply(removed ? `已移除：${removed.title}` : "没有这个序号。");
      return;
    }

    if (interaction.commandName === "clear") {
      player.queue = [];
      await interaction.reply("队列已清空。");
    }
  } catch (error) {
    console.error(error);
    const message = "出错了。检查机器人是否有语音频道权限，或者看运行日志。";
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(message);
    } else {
      await interaction.reply(message);
    }
  }
});

client.login(config.token);
