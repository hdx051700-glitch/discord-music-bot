import "dotenv/config";

export const config = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  guildId: process.env.DISCORD_GUILD_ID
};

export function assertConfig(requiredKeys = ["token"]) {
  const missing = requiredKeys
    .map((key) => [key, config[key]])
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(`Missing env values: ${missing.join(", ")}`);
  }
}
