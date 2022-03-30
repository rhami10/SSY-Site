import * as THREE from 'three'
import Tile from './Tile'
import { ev } from './utils/utils'

import trippyShader from '../glsl/trippyShader.glsl'
import revealShader from '../glsl/revealShader.glsl'

///////////////////////////

const chosenShaderIndex = 0;

///////////////////////////

const perspective = 800

const shaders = [
    trippyShader,
    revealShader
]

const durations = [
    0.5,
    0.8
]

export default class Scene {

    constructor($scene) {
        this.container = $scene
        this.$tile = document.querySelector('.slideshow-list__el')

        this.W = window.innerWidth
        this.H = window.innerHeight

        this.mouse = new THREE.Vector2(0, 0)

        this.start()

        this.bindEvent()
    }

    bindEvent() {
        document.addEventListener('toggleDetail', ({ detail: shouldOpen }) => { this.onToggleView(shouldOpen) })
        window.addEventListener('resize', () => { this.onResize() })
    }


    start() {
        this.mainScene = new THREE.Scene()
        this.initCamera()
        this.initLights()

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.container,
            alpha: true,
        })
        this.renderer.setSize(this.W, this.H)
        this.renderer.setPixelRatio(window.devicePixelRatio)

        this.tile = new Tile(this.$tile, this, durations[chosenShaderIndex], shaders[chosenShaderIndex])

        this.update()
    }

    initCamera() {
        const fov = (180 * (2 * Math.atan(this.H / 2 / perspective))) / Math.PI

        this.camera = new THREE.PerspectiveCamera(fov, this.W / this.H, 1, 10000)
        this.camera.position.set(0, 0, perspective)
    }

    initLights() {
        const ambientlight = new THREE.AmbientLight(0xffffff, 2)
        this.mainScene.add(ambientlight)
    }




    /* Handlers
    --------------------------------------------------------- */

    onResize() {
        this.W = window.innerWidth
        this.H = window.innerHeight

        this.camera.aspect = this.W / this.H

        this.camera.updateProjectionMatrix()
        this.renderer.setSize(this.W, this.H)
    }

    onToggleView({ open }) {
        ev('tile:zoom', { tile: this.tile, open })
    }

    /* Actions
    --------------------------------------------------------- */

    update() {
        requestAnimationFrame(this.update.bind(this))

        this.tile.update()

        this.renderer.render(this.mainScene, this.camera)
    }

}
