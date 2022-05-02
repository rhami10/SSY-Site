import '../sass/styles.scss'
import Stage from './Stage'

const APP = window.APP || {}

const camp_det = [
    {
        name: "savio", 
        title: "SSY Savio", title_2: "Sports Camp", 
        detail: ["Boys (Y7 - Y10"], 
        link: "https://www.saviosalesianyouth.org/applysavio",
        images: ["https://raw.githubusercontent.com/rhami10/SSY-Site/main/img/tiles/savio/base.jpg", "https://raw.githubusercontent.com/rhami10/SSY-Site/main/img/tiles/savio/hover.jpg"]
    },
    {
        name: "bosco", 
        title: "SSY Bosco", title_2: "Sports Camp",
        detail: ["Boys (Y6 - Y8)"], 
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
        title: "SSY", title_2: "Adventure", title_3: "Camp", 
        detail: ["Boys & Girls (Y9 - Y11)"],
        link: "https://www.saviosalesianyouth.org/applyadventure",
        images: ["https://raw.githubusercontent.com/rhami10/SSY-Site/main/img/tiles/adventure/base.jpg", "https://raw.githubusercontent.com/rhami10/SSY-Site/main/img/tiles/adventure/hover.jpg"]
    }
]

const initApp = () => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const camp_type = urlParams.get('camp');
    const shader_type = urlParams.get('shader');

    let camp_det_index = camp_det.findIndex((el) => el.name == camp_type)
    let campSelected = camp_det[camp_det_index];

    if(campSelected != null)
    {
        /* Setting up tile image. */
        document.getElementById("tileImage").src = campSelected.images[0];
        document.getElementById("tileImage").setAttribute('data-hover', campSelected.images[1]);
        document.getElementById("tileImage").setAttribute('alt', campSelected.title.concat(campSelected.title_2));
    

        /* Setting up title text. */
        let title = document.querySelector(".tile__title")
        title.innerHTML = campSelected.title;

        if(camp_det_index != 3)
        {
            title.innerHTML += ' <span class="title__offset title__offset--medium">' + campSelected.title_2 + '</span>'
        }
        else    // Adventure Camp
        {
            title.innerHTML += 
                ' <span class="title__offset title__offset--xs">' + campSelected.title_2 + '</span>' +
                ' <span class="title__offset title__offset--s">' + campSelected.title_3 + '</span>'
        }


        /* Setting up caption text. */
        document.querySelector(".tile__cta__text").innerHTML = campSelected.detail[0];
        if(camp_det_index == 2) document.querySelector(".tile__cta").innerHTML += '<span class="btn-inline tile__cta__text">' + campSelected.detail[1] + '</span>';
    

        /* Setting text colours. */
        document.documentElement.style.setProperty('--color-text', `var(--color-text${camp_det_index+1})`);

        window.APP = APP
        APP.Stage = new Stage(shader_type, campSelected.link)
    }
}

if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
    initApp()
    console.log("JS File Fired. IF statement.")
} else {
    document.addEventListener('DOMContentLoaded', initApp)
    console.log("JS File Fired. Else statement.")
}
