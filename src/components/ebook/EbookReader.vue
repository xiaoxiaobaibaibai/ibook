<template>
    <div class="ebook-reader">
        <div id="read">
        </div>
    </div>
</template>

<script>
import Epub from 'epubjs'
import { ebookMixin } from '@/utils/mixin.js'
import { 
    getFontFamily, saveFontFamily,
    getFontSize, saveFontSize,
    getTheme, saveTheme, getLocation 
    } from '@/utils/localStorage'

global.ePub = Epub
export default {
    mixins: [ebookMixin],
    methods: {
        prevPage() {
            if (this.rendition) {
                this.rendition.prev().then(() => {
                    this.refreshLocation()
                })
                this.hideTitleAndMenu()
            }
        },
        nextPage() {
            if (this.rendition) {
                this.rendition.next().then(() => {
                    this.refreshLocation()
                })
                this.hideTitleAndMenu()
            }
        },
        toggleTitleAndMenu() {
            //this.$store.dispatch('setMenuVisible', !this.menuVisible)
            if (this.menuVisible) {
                this.setSettingVisible(-1)
                this.setFontFamilyVisible(false)
            }
            this.setMenuVisible(!this.menuVisible)
        },
        // hideTitleAndMenu() {
        //    // this.$store.dispatch('setMenuVisible', false)
        //     this.setMenuVisible(false)
        //     this.setSettingVisible(-1)
        //     this.setFontFamilyVisible(false)
        // },
        initTheme() {
            let defaultTheme = getTheme(this.fileName)
            if (!defaultTheme) {
                defaultTheme = this.themeList[0].name
                saveTheme(this.fileName, defaultTheme)
            }
            this.setDefaultTheme(defaultTheme)
            this.themeList.forEach(theme => {
                this.rendition.themes.register(theme.name, theme.style)
            })
            this.rendition.themes.select(defaultTheme)
        },
        initFontSize() {
            const fontSize = getFontSize(this.fileName)
                if (!fontSize) {
                    saveFontSize(this.fileName, this.defaultFontSize)
                } else {
                    this.rendition.themes.fontSize(fontSize)
                    this.setDefaultFontSize(fontSize)
                }
        },
        initFontFamily() {
            const font = getFontFamily(this.fileName)
                if (!font) {
                    saveFontFamily(this.fileName, this.defaultFontFamily)
                } else {
                    this.rendition.themes.font(font)
                    this.setDefaultFontFamily(font)
                }
},
        initRendition() {
            this.rendition = this.book.renderTo('read', {
                width: innerWidth,
                height: innerHeight,
                methods: 'default' // 微信的兼容性配置
            })
            const location = getLocation(this.fileName)
            this.display(location, () => {
                this.initTheme()
                this.initFontSize()
                this.initFontFamily()
                this.initGlobalStyle()
                this.refreshLocation()
            this.rendition.on('touchstart', event => {
                this.touchStartX = event.changedTouches[0].clientX
                this.touchStartTime = event.timeStamp
                //console.log(event)
            })
            this.rendition.on('touchend', event => {
                const offSetX = event.changedTouches[0].clientX - this.touchStartX
                const time = event.timeStamp - this.touchStartTime
                // console.log(offSetX, time)
                if (time < 500 && offSetX > 40) {
                    this.prevPage()
                } else if (time < 500 && offSetX < -40) {
                    this.nextPage()
                } else {
                    this.toggleTitleAndMenu()
                }
                 // event.preventDefault()
                event.stopPropagation()
            })
            })
        },
        initGestrue() {
            this.rendition.hooks.content.register(contents => {
                Promise.all(
                    [
                contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
                contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
                contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
                contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)]
                 )//.then(() => {
                //     console.log(...)
                // })
                })
        },
        parseBook() {
            this.book.loaded.cover.then(cover => {
                this.book.archive.createUrl(cover).then(url => {
                    this.setCover(url)
                })
            })
            this.book.loaded.metadata.then(metadata => {
                this.setMetadata(metadata)
            })
        },
        initEpub() {
            const url = process.env.VUE_APP_RES_URL + '/epub/' + this.fileName + '.epub'
            this.book = new Epub(url)
            this.setCurrentBook(this.book)
            // console.log(this.book)
            this.initRendition()
            this.initGestrue()
            this.parseBook()
            this.book.ready.then(() => {
                return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
            }).then(locations => {
                // console.log(locations)
                this.setBookAvailable(true)
                this.refreshLocation()
            })
        }        
},
    mounted() {
        //const fileName = this.$route.params.fileName.split('|').join('/')
        this.setFileName(this.$route.params.fileName.split('|').join('/')).then(() => {
            this.initEpub()
        })
        }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
   @import "../../assets/styles/global"
</style>
