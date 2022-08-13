const ping = require("ping");
const cron = require("cron");
const fs = require("fs");
const { format } = require("date-fns");

const host = "google.com";

const getFileName = () => `./data/${format(new Date(), "dd-MM-yyyy")}.csv`;
const formatResult = (result) => ({
  date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
  host: result.host,
  alive: result.alive,
  time: result.time,
});

async function pingHost() {
  try {
    const result = await ping.promise.probe(host, {
      timeout: 10,
    });
    const data = formatResult(result);
    fs.writeFileSync(getFileName(), Object.values(data).join(",") + "\n", {
      flag: "a",
    });
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

const job = new cron.CronJob("*/10 * * * * *", pingHost);
job.start();
