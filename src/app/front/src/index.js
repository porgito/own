import Tournament from "../views/Tournament.js";
import Landing from "../views/Landing.js";
import Login from "../views/Login.js";
import Signup from "../views/Signup.js";
import NotFound from "../views/NotFound.js";
import About from "../views/about.js";
import Profile from "../views/Profile.js";
import Settings from "../views/Settings.js";
import { getNav, getSocial, getChat } from '../views/utils.js';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../theme/base.css'
import '../theme/game.css'
import '../theme/index.css'


const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: "/", view: Landing },
        { path: "/login", view: Login },
        { path: "/signup", view: Signup },
        { path: "/tournament", view: Tournament },
        { path: "/about", view: About},
        { path: "/profile", view: Profile},
        { path: "/settings", view: Settings},
        { path: "/404", view: NotFound},
        
    ];

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: { path: location.pathname, view: NotFound },
            result: [location.pathname]
        };
    }

    const view = new match.route.view(getParams(match));

    const currentPath = location.pathname;

    const navHTML = (currentPath === "/login" || currentPath === "/signup") ? '' : await getNav(currentPath);
    document.querySelector("#nav").innerHTML = navHTML;

    const chatHTML = (currentPath === "/login" || currentPath === "/signup") ? '' : await getChat(currentPath);
    document.querySelector("#chat").innerHTML = chatHTML;

    const socialHTML = (currentPath === "/login" || currentPath === "/signup") ? '' : await getSocial(currentPath);
    document.querySelector("#social").innerHTML = socialHTML;

    document.querySelector("#app").innerHTML = await view.getHtml();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router();
});