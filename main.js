import Discord from "discord.js";
import dotenv from "dotenv";
import ms from "ms";

dotenv.config();

const log = console.log;
const error = console.error;

const client = new Discord.Client({
  shards: "auto",
  intents: [Discord.GatewayIntentBits.Guilds],
});

log(process.env.TOKEN ? "✅ Found TOKEN Env var" : "❌ Missing TOKEN Env var");

async function login() {
  log("Attempting login...");
  try {
    await client.login(process.env.TOKEN);

    log("🤖 Logged in");
  } catch (e) {
    log("🫤 Failed to login, error:", e);
  }
}

async function getPrice() {
  try {
    const raw = await fetch("https://api.coinbase.com/v2/prices/sol-gbp/spot");
    const { data } = await raw.json();
    return Math.round(+data.amount * 100) / 100;
  } catch (e) {
    error("Failed to fetch from coinbase api, error:", e);
  }
}
console.log(await getPrice());

async function setBotActivity() {
  const price = await getPrice();
  if (!price) return;

  const ClientPresence = await client.user.setActivity(`£${price}`, {
    type: Discord.ActivityType.Watching,
  });

  log(`Activity set to ${ClientPresence.activities[0].name}`);
}

(async function main() {
  await login();
  setInterval(setBotActivity, ms("30 sec"));
})();
