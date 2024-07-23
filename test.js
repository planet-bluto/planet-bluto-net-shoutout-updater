const friends = require("./friends.json")
const ShoutoutSiteUpdater = require("./main.js")

ShoutoutSiteUpdater(friends).then(() => {
  console.log("Done!")
})