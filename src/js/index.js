import '../sass/styles.scss'
import Stage from './Stage'

const APP = window.APP || {}

const initApp = () => {
    window.APP = APP
    APP.Stage = new Stage()
}

if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
    initApp()
} else {
    document.addEventListener('DOMContentLoaded', initApp)
}
