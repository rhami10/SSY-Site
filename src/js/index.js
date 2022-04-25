import '../sass/styles.scss'
import Stage from './Stage'

const APP = window.APP || {}

const camp_det = [
    {name: "savio", title: "SSY Savio", title_2: "Sports Camp", images: [url("/img/tiles/savio/base.jpg"), url("/img/tiles/savio/base.jpg")]},
    {name: "bosco", title: "SSY Bosco", title_2: "Sports Camp", images: ["", ""]},
    {name: "creative", title: "SSY Creative", title_2: "Arts Camp", images: ["", ""]},
    {name: "adventure", title: "SSY Adventure", title_2: "Camp", images: ["", ""]},
]

// const camp_det = [
//     {name: "savio", title: "SSY Savio", title_2: "Sports Camp", images: ["/img/tiles/savio/base.jpg", "/img/tiles/savio/hover.jpg"]},
//     {name: "bosco", title: "SSY Bosco", title_2: "Sports Camp", images: ["", ""]},
//     {name: "creative", title: "SSY Creative", title_2: "Arts Camp", images: ["", ""]},
//     {name: "adventure", title: "SSY Adventure", title_2: "Camp", images: ["", ""]},
// ]

const initApp = () => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const camp_type = urlParams.get('camp');
    const shader_type = urlParams.get('shader');

    var camp_det_index = camp_det.findIndex((el) => el.name == camp_type);

    document.querySelector(".tile__title").innerHTML = camp_det[camp_det_index].title + ' <span class="title__offset title__offset--small">' + camp_det[camp_det_index].title_2 + '</span>'

    document.getElementById("tileImage").src = camp_det[camp_det_index].images[0];
    document.getElementById("tileImage").setAttribute('data-hover', camp_det[camp_det_index].images[1]);
    document.getElementById("tileImage").setAttribute('alt', camp_det[camp_det_index].title.concat(camp_det[camp_det_index].title_2));
    document.getElementById


    window.APP = APP
    APP.Stage = new Stage(shader_type)
}

if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
    initApp()
    console.log("JS File Fired. IF statement.")
} else {
    document.addEventListener('DOMContentLoaded', initApp)
    console.log("JS File Fired. Else statement.")
}
