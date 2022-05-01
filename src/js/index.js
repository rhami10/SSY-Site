import '../sass/styles.scss'
import Stage from './Stage'

const APP = window.APP || {}

const camp_det = [
    {
        name: "savio", 
        title: "SSY Savio", title_2: "Sports Camp", 
        detail: ["Boys & Girls (Y9 - Y11)"], 
        link: "https://www.saviosalesianyouth.org/applysavio",
        images: ["https://raw.githubusercontent.com/rhami10/SSY-Site/main/img/tiles/savio/base.jpg", "https://raw.githubusercontent.com/rhami10/SSY-Site/main/img/tiles/savio/hover.jpg"]
    },
    {
        name: "bosco", 
        title: "SSY Bosco", title_2: "Sports Camp",
        detail: ["Boys (Y7 - Y10)"], 
        link: "https://www.saviosalesianyouth.org/applybosco",
        images: ["https://raw.githubusercontent.com/rhami10/SSY-Site/main/img/tiles/bosco/base.jpg", "https://raw.githubusercontent.com/rhami10/SSY-Site/main/img/tiles/bosco/hover.jpg"]
    },
    {
        name: "creative", 
        title: "SSY Creative", title_2: "Arts Camp", 
        detail: ["Boys (Y10 - Y11)", "Girls (Y6 - Y11)"],
        link: "https://www.saviosalesianyouth.org/applycreative",
        images: ["https://raw.githubusercontent.com/rhami10/SSY-Site/main/img/tiles/creative/base.jpg", "https://raw.githubusercontent.com/rhami10/SSY-Site/main/img/tiles/creative/hover.jpg"]
    },
    {
        name: "adventure", 
        title: "SSY Adventure", title_2: "Camp", 
        detail: ["Boys (Y6 - Y8)"],
        link: "https://www.saviosalesianyouth.org/applyadventure",
        images: ["https://raw.githubusercontent.com/rhami10/SSY-Site/main/img/tiles/adventure/base.jpg", "https://raw.githubusercontent.com/rhami10/SSY-Site/main/img/tiles/adventure/hover.jpg"]
    }
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

    /* Setting up tile image */
    document.getElementById("tileImage").src = camp_det[camp_det_index].images[0];
    document.getElementById("tileImage").setAttribute('data-hover', camp_det[camp_det_index].images[1]);
    document.getElementById("tileImage").setAttribute('alt', camp_det[camp_det_index].title.concat(camp_det[camp_det_index].title_2));
    
    /* Setting up form link */
    document.getElementById("linkForm").setAttribute('href', camp_det[camp_det_index].link);

    /* Setting up textual elements */
    document.querySelector(".tile__title").innerHTML = camp_det[camp_det_index].title + ' <span class="title__offset title__offset--small">' + camp_det[camp_det_index].title_2 + '</span>'
    
    let subtexts = document.querySelectorAll(".tile__cta__text");
    
    console.log(subtexts);
    subtexts[0].innerHTML = camp_det[camp_det_index].detail[0];
    // if(camp_det_index == 3) subtexts[1].innerHTML = camp_det[camp_det_index].detail[1];

    document.documentElement.style.setProperty('--color-text', `var(--color-text${camp_det_index+1})`);

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
