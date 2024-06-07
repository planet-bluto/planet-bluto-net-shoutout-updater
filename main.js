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
    "Authorization": "259bafebcf7e84fc645b4e267966ce80cbf455c0ba5de4fa3f50420c51156075"
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

module.exports = (artists) => {
  artists.forEach(async artist => {
    var artistId = (artist.id || (artist.name).toLowerCase())

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
    var templateHTML = await fsProm.readFile("site_template.html", "utf-8")
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
    await uploadFiles(`shoutout/${artistId}`, [
      `./output/${artistId}/buttons.js`,
      `./output/${artistId}/artist.${icon_ext}`,
      `./output/${artistId}/index.html`,
    ])
  })
}