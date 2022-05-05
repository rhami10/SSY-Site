import * as THREE from 'three'
import { TweenMax as TM, Power2, Power3, Expo } from 'gsap/all'
import Scrollbar from 'smooth-scrollbar'
import vertexShader from '../glsl/vertexShader.glsl'
import { SplitText as ST } from './vendors/gsap/SplitText'

import { clamp, getRatio, wrap, ev } from './utils/utils'

export default class Tile {

    constructor($el, scene, duration, fragmentShader, hrefLink) {
        this.scene = scene

        this.hrefLink = hrefLink;

        this.$els = {
            body: document.body,
            el: $el,
            link: $el.querySelector('a'),
            text: $el.querySelectorAll('.tile__title, .tile__cta'),
            title: $el.querySelector('.tile__title').innerText,
        }

        this.duration = duration

        this.mainImage = this.$els.el.querySelector('img')
        this.images = []
        this.sizes = new THREE.Vector2(0, 0)
        this.offset = new THREE.Vector2(0, 0)

        this.vertexShader = vertexShader
        this.fragmentShader = fragmentShader

        this.clock = new THREE.Clock()

        this.mouse = new THREE.Vector2(0, 0)

        this.scroll = 0
        this.delta = 0
        this.hasClicked = false
        this.isZoomed = false

        this.loader = new THREE.TextureLoader()
        this.preload([this.mainImage.src, this.mainImage.dataset.hover], () => { this.initTile() })

        this.Scroll = Scrollbar.get(document.querySelector('.scrollarea'))

        this.bindEvent()
    }

    bindEvent() {
        document.addEventListener('tile:zoom', ({ detail }) => { this.zoom(detail) })

        window.addEventListener('resize', () => { this.onResize() })
        window.addEventListener('mousemove', (e) => { this.onMouseMove(e) })

        this.$els.link.addEventListener('mouseenter', () => { this.onPointerEnter() })
        this.$els.link.addEventListener('mouseleave', () => { this.onPointerLeave() })
        this.$els.link.addEventListener('click', (e) => { this.onClick(e) })
        this.$els.link.addEventListener('auxclick', (e) => { this.onClick(e) })
    }

    /* Handlers
    --------------------------------------------------------- */

    onClick(e) {
        e.preventDefault()

        if (!this.mesh) return

        this.hasClicked = true
        
        window.open(this.hrefLink, '_blank').focus();

        // ev('toggleDetail', {
        //     open: true
        // })

        // To be run when needing to animate the closing sequence for tiles... reversing toggleDetail operation: Zoom, and perhaps, Close Modal?
        //
        // TM.delayedCall(0.3, () => {
        //     ev('toggleDetail', {
        //         open: false,
        //         force: true,
        //     })
        // })
    }

    onPointerEnter() {
        this.isHovering = true

        // Adjusting Background Colour
        const idx = clamp([...this.$els.el.parentElement.children].indexOf(this.$els.el) + 1, 1, 5)
        //document.documentElement.style.setProperty('--color-bg', `var(--color-bg${idx})`)
        //document.documentElement.style.setProperty('--color-text', `var(--color-text${idx})`)


        if (!this.mesh) return

        TM.to(this.uniforms.u_progressHover, this.duration, {
            value: 1,
            ease: Power2.easeInOut,
        })
    }

    onPointerLeave() {
        if (!this.mesh) return

        TM.to(this.uniforms.u_progressHover, this.duration, {
            value: 0,
            ease: Power2.easeInOut,
            onComplete: () => {
                this.isHovering = false
            },
        })
    }

    onResize() {
        this.getBounds()

        if (!this.mesh) return

        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)
        this.uniforms.u_res.value.set(window.innerWidth, window.innerHeight)
    }

    onMouseMove(event) {

        TM.to(this.mouse, 0.5, {
            x: event.clientX,
            y: event.clientY,
        })
    }


    /* Actions
    --------------------------------------------------------- */

    initTile() {
        this.stgs = new ST(this.$els.text, { type: 'lines', linesClass: 'line' })

        this.stgs.lines.forEach((l) => {
            const div = document.createElement('div')
            div.classList.add('line-ctn')
            wrap(l, div)
        })

        const texture = this.images[0]
        const hoverTexture = this.images[1]

        this.getBounds()

        this.uniforms = {
            u_alpha: { value: 1 },
            u_map: { type: 't', value: texture },
            u_ratio: { value: getRatio(this.sizes, texture.image) },
            u_hovermap: { type: 't', value: hoverTexture },
            u_hoverratio: { value: getRatio(this.sizes, hoverTexture.image) },
            u_shape: { value: this.images[2] },
            u_mouse: { value: this.mouse },
            u_progressHover: { value: 0 },
            u_progressClick: { value: 0 },
            u_time: { value: this.clock.getElapsedTime() },
            u_res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        }

        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
            transparent: true,
            defines: {
                PI: Math.PI,
                PR: window.devicePixelRatio.toFixed(1),
            },
        })

        this.mesh = new THREE.Mesh(this.geometry, this.material)

        this.mesh.position.x = this.offset.x
        this.mesh.position.y = this.offset.y

        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)

        this.scene.mainScene.add(this.mesh)

        this.mainImage.classList.add('is-loaded')
    }

    move() {
        if (!this.mesh) return
        this.getBounds()

        TM.set(this.mesh.position, {
            x: this.offset.x,
            y: this.offset.y,
        })

        TM.to(this.mesh.scale, 0.3, {
            x: this.sizes.x - this.delta,
            y: this.sizes.y - this.delta,
            z: 1,
        })
    }

    update() {

        if (!this.mesh) return

        this.move()

        if (!this.isHovering) return
        this.uniforms.u_time.value += this.clock.getDelta()
    }

    zoom({ tile, open }) {
        
        const shouldZoom = tile === this

        // Noise Image Enlarging
        TM.to(this.uniforms.u_progressClick, 1.2, {
            value: shouldZoom ? 1 : 0,
            ease: Power2.easeInOut,
            onComplete: () => {
                this.isZoomed = shouldZoom
                this.hasClicked = open

                TM.to(this.uniforms.u_progressHover, this.duration, {
                    value: shouldZoom ? 1 : 0,
                    ease: Power2.easeInOut,
                })

                ev('view:toggle', { shouldOpen: shouldZoom, target: this })
            },
        })

        // Controlling Text Lines w/ Image
        TM.staggerTo(this.stgs.lines, 1, {
            yPercent: shouldZoom ? 100 : 0,
            ease: Expo.easeInOut,
            force3D: true,
        }, 0.35 / this.stgs.lines.length)
    }


    /* Values
    --------------------------------------------------------- */

    getBounds() {
        const { width, height, left, top } = this.mainImage.getBoundingClientRect()

        if (!this.sizes.equals(new THREE.Vector2(width, height))) {
            this.sizes.set(width, height)
        }

        if (!this.offset.equals(new THREE.Vector2(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2))) {
            this.offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2)
        }
    }

    preload($els, allImagesLoadedCallback) {
        let loadedCounter = 0
        const toBeLoadedNumber = $els.length
        const preloadImage = ($el, anImageLoadedCallback) => {
            const image = this.loader.load($el, anImageLoadedCallback)
            image.center.set(0.5, 0.5)
            this.images.push(image)
        }

        $els.forEach(($el) => {
            preloadImage($el, () => {
                loadedCounter += 1
                if (loadedCounter === toBeLoadedNumber) {
                    allImagesLoadedCallback()
                }
            })
        })
    }

}

