import '../sass/styles.scss'
import Stage from './Stage'

const APP = window.APP || {}

const camp_det = [
    {name: "savio", title: "SSY Savio ", title_2: "Sports Camp", images: ["https://static.wixstatic.com/media/f07703_f8ab5d641e0448fe903d717e1a3e7f6f~mv2.jpg", "https://static.wixstatic.com/media/f07703_2abced15466f4e0382cd02eb98d0b633~mv2.jpg"]},
    {name: "bosco", title: "SSY Bosco ", title_2: "Sports Camp", images: ["", ""]},
    {name: "creative", title: "SSY Creative ", title_2: "Arts Camp", images: ["", ""]},
    {name: "adventure", title: "SSY Adventure ", title_2: "Camp", images: ["", ""]},
]

const initApp = () => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const camp_type = urlParams.get('camp');

    var camp_det_index = camp_det.findIndex((el) => el.name == camp_type);

    document.getElementById("tileTitle1").innerText = camp_det[camp_det_index].title;
    document.querySelector("#tileTitle2").textContent = camp_det[camp_det_index].title_2;

    document.getElementById("tileImage").src = camp_det[camp_det_index].images[0];
    document.getElementById("tileImage").setAttribute('data-hover', camp_det[camp_det_index].images[1]);
    document.getElementById("tileImage").setAttribute('alt', camp_det[camp_det_index].title.concat(camp_det[camp_det_index].title_2));

    window.APP = APP
    APP.Stage = new Stage()
}

if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
    initApp()
    console.log("JS File Fired. IF statement.")
} else {
    document.addEventListener('DOMContentLoaded', initApp)
    console.log("JS File Fired. Else statement.")
}
