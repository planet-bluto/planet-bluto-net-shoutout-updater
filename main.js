global.print = console.log

const fetch = require("node-fetch")
var fs = require('fs')
var fsProm = require('fs/promises')
var fsExtra = require('fs-extra')
var path = require('path')
var FormData = require('form-data')
require("./arrayLib.js")

async function uploadFiles(sitePath, filePaths) {
  var form = new FormData()

  form.append("pathname", sitePath)
  filePaths.forEach(filePath => {
    form.append("files", fs.createReadStream(filePath))
  })

  var headers = Object.assign({
    "Authorization": process.env["NEKOWEB_KEY"]
  }, form.getHeaders())

  var res = await fetch(`https://nekoweb.org/api/files/upload`, {
    method: "POST",
    headers,
    body: form
  })

  var text = await res.text()

  return text
}

function format(str) {
	str = str.toUpperCase()
	str = ">" + str
	str = str.replaceAll(" ", "_")
	// str = str + "..."
	return str
}

module.exports = async (artists) => {
  await artists.awaitForEach(async artist => {
    var artistId = artist.id
    if (artistId == null) { return }

    // Buttons //
    var buttonJStext = []
    Object.keys(artist.links).forEach(platform => {
      var url = artist.links[platform]
      buttonJStext.push(`make_button("${platform}", "${url}")`)
    })
    buttonJStext = buttonJStext.join("\n")

    // Artist Icon //
    if (artist.icon) {
      var icon_ext = (artist.style.animated_icon ? "gif" : "png")
      var icon_res = await fetch(artist.icon)
      var icon_data = await icon_res.buffer()
    } else {
      var icon_ext = "png"
      var icon_res = await fetch("https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2754.png")
      var icon_data = await icon_res.buffer()
    }

    // index.html //
    var templateHTML = await fsProm.readFile("./node_modules/planet-bluto-net-shoutout-updater/site_template.html", "utf-8")
    templateHTML = templateHTML.replaceAll("[pb_artist_id]", artistId)
    templateHTML = templateHTML.replaceAll("[pb_artist_name]", artist.name)
    templateHTML = templateHTML.replaceAll("[pb_artist_name_formatted]", format(artist.name))
    templateHTML = templateHTML.replaceAll("[pb_artist_desc]", artist.desc)
    templateHTML = templateHTML.replaceAll("[pb_artist_name_color]", artist.style.name_color)
    templateHTML = templateHTML.replaceAll("[pb_artist_icon_ext]", icon_ext)

    // Write Files Locally //
    await Promise.all([
      fsExtra.outputFile(`./output/${artistId}/buttons.js`, buttonJStext),
      fsExtra.outputFile(`./output/${artistId}/artist.${icon_ext}`, icon_data),
      fsExtra.outputFile(`./output/${artistId}/index.html`, templateHTML)
    ])

    // Write to Nekoweb //
    async function tryUpload() {
      try {
        await uploadFiles(`shoutout/${artistId}`, [
          `./output/${artistId}/buttons.js`,
          `./output/${artistId}/artist.${icon_ext}`,
          `./output/${artistId}/index.html`,
        ])
      } catch(err) {
        console.log(`${artistId} Upload to Nekoweb failed! `, err)
        console.log("Retrying in 30 seconds...")
        await (new Promise((res, rej) => {
          setTimeout(async () => {
            await tryUpload()
            res()
          }, 1000 * 30)
        }))
      }
    }

    await tryUpload()
  })
}
