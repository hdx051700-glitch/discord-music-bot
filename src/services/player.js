import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  getVoiceConnection,
  joinVoiceChannel,
  NoSubscriberBehavior,
  VoiceConnectionStatus
} from "@discordjs/voice";
import ffmpegPath from "ffmpeg-static";
import { request } from "undici";

if (ffmpegPath) {
  process.env.FFMPEG_PATH = ffmpegPath;
}

export class GuildMusicPlayer {
  constructor(guildId) {
    this.guildId = guildId;
    this.queue = [];
    this.current = null;
    this.loopMode = "off";
    this.volume = 0.7;
    this.connection = null;
    this.audioPlayer = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play
      }
    });

    this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
      void this.handleIdle();
    });
    this.audioPlayer.on("error", (error) => {
      console.error("Audio player error:", error);
      void this.handleIdle();
    });
  }

  async connect(voiceChannel) {
    const existing = getVoiceConnection(this.guildId);
    if (existing) this.connection = existing;

    if (!this.connection) {
      this.connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        selfDeaf: false
      });
      this.connection.subscribe(this.audioPlayer);
    }

    await entersState(this.connection, VoiceConnectionStatus.Ready, 20_000);
    return this.connection;
  }

  async enqueue(track) {
    this.queue.push(track);
    if (!this.current) await this.playNext();
  }

  async playDirectUrl(track) {
    this.current = track;
    const response = await request(track.url);
    const resource = createAudioResource(response.body, { inlineVolume: true });
    resource.volume?.setVolume(this.volume);
    this.audioPlayer.play(resource);
  }

  async playNext() {
    const next = this.queue.shift();
    if (!next) {
      this.current = null;
      return;
    }
    await this.playDirectUrl(next);
  }

  async handleIdle() {
    if (this.current && this.loopMode === "track") {
      await this.playDirectUrl(this.current);
      return;
    }

    if (this.current && this.loopMode === "queue") {
      this.queue.push(this.current);
    }

    await this.playNext();
  }

  skip() {
    this.audioPlayer.stop(true);
  }

  pause() {
    return this.audioPlayer.pause();
  }

  resume() {
    return this.audioPlayer.unpause();
  }

  stop() {
    this.queue = [];
    this.current = null;
    this.audioPlayer.stop(true);
    this.connection?.destroy();
    this.connection = null;
  }

  setLoop(mode) {
    this.loopMode = mode;
  }

  shuffle() {
    for (let i = this.queue.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
    }
  }

  setVolume(value) {
    this.volume = value / 100;
  }

  remove(index) {
    return this.queue.splice(index, 1)[0];
  }
}

const players = new Map();

export function getPlayer(guildId) {
  if (!players.has(guildId)) {
    players.set(guildId, new GuildMusicPlayer(guildId));
  }
  return players.get(guildId);
}
