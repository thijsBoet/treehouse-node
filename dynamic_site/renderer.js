const fs = require('fs')

mergeValues = (values, content) => {

    for (let key in values) {
        content = content.replace(`{{${key}}}`, values[key])
    }
    return content
}

view = (templateName, values, response) => {
    let fileContents = fs.readFileSync(`./views/${templateName}.html`, { encoding: "utf8" });

    fileContents = mergeValues(values, fileContents)
    response.write(fileContents)
}

module.exports.view = view;