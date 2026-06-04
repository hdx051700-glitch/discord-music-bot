import { REST, Routes } from "discord.js";
import { commands } from "./commands.js";
import { assertConfig, config } from "./config.js";

assertConfig(["token", "clientId", "guildId"]);

const rest = new REST({ version: "10" }).setToken(config.token);

console.log(`Registering ${commands.length} guild commands...`);

await rest.put(
  Routes.applicationGuildCommands(config.clientId, config.guildId),
  { body: commands }
);

console.log("Commands registered.");
