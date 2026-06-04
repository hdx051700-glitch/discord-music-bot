import { SlashCommandBuilder } from "discord.js";

export const commands = [
  new SlashCommandBuilder()
    .setName("hdxbaba")
    .setDescription("黄鼎雄是我爸爸：搜索一首歌或播放音频直链")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("歌名、YouTube/网易云关键词，或可播放的音频直链")
        .setRequired(true)
    ),
  new SlashCommandBuilder().setName("queue").setDescription("查看播放队列"),
  new SlashCommandBuilder().setName("now").setDescription("查看当前播放"),
  new SlashCommandBuilder().setName("skip").setDescription("跳过当前歌曲"),
  new SlashCommandBuilder().setName("pause").setDescription("暂停播放"),
  new SlashCommandBuilder().setName("resume").setDescription("继续播放"),
  new SlashCommandBuilder().setName("stop").setDescription("停止播放并离开语音频道"),
  new SlashCommandBuilder()
    .setName("loop")
    .setDescription("设置循环模式")
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("关闭、单曲循环、队列循环")
        .setRequired(true)
        .addChoices(
          { name: "关闭", value: "off" },
          { name: "单曲循环", value: "track" },
          { name: "队列循环", value: "queue" }
        )
    ),
  new SlashCommandBuilder().setName("shuffle").setDescription("打乱当前队列"),
  new SlashCommandBuilder()
    .setName("volume")
    .setDescription("设置音量 1-100")
    .addIntegerOption((option) =>
      option
        .setName("value")
        .setDescription("1 到 100")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("remove")
    .setDescription("按序号移除队列中的歌曲")
    .addIntegerOption((option) =>
      option
        .setName("index")
        .setDescription("队列里的序号，从 1 开始")
        .setMinValue(1)
        .setRequired(true)
    ),
  new SlashCommandBuilder().setName("clear").setDescription("清空待播队列")
].map((command) => command.toJSON());
