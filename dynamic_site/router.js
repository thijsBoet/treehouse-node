const Profile = require("./profile.js");
const renderer = require("./renderer");
const querystring = require("querystring")
const commonHeaders = { "Content-Type": "text/html" }

home = (request, response) => {
    if (request.url === "/") {
        if (request.method.toLowerCase() === "get") {
            response.writeHead(200, commonHeaders);
            renderer.view("header", {}, response);
            renderer.view("search", {}, response);
            renderer.view("footer", {}, response);
            response.end()
        }
        if (request.method.toLowerCase() === "post") {
            request.on('data', (postBody) => {
                const query = querystring.parse(postBody.toString())
                response.writeHead(303, {"Location":  `/${query.username}`})

                response.end()
            })
        }
    }
};

user = (request, response) => {
    const username = request.url.replace("/", "");
    if (username.length > 0) {
        response.writeHead(200, commonHeaders);
        renderer.view("header", {}, response);
        var studentProfile = new Profile(username);


        studentProfile.on("end", (profileJSON) => {


            const values = {
                avatarUrl: profileJSON.gravatar_url,
                username: profileJSON.profile_name,
                badges: profileJSON.badges.length,
                javascriptPoints: profileJSON.points.JavaScript
            }

            renderer.view("profile", values, response);
            renderer.view("footer", {}, response);
            response.end()
        });

        studentProfile.on("error", (error) => {
            renderer.view("error", { errorMessage: error.message }, response);
            renderer.view("search", {}, response);
            renderer.view("footer", {}, response);
            response.end()
        })
    }
};

module.exports.home = home
module.exports.user = user