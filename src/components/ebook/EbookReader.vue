<template>
    <div class="ebook-reader">
        <div id="read"></div>
        <div class="ebook-reader-mask"
             @click="onMaskClick"
             @touchmove="move"
             @touchend="moveEnd"
             @mousedown.left="onMouseEnter"
             @mousemove="onMouseMove"
             @mouseup.left="onMouseEnd"></div>
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
import { flatten } from '../../utils/book'
global.ePub = Epub
export default {
    mixins: [ebookMixin],
    methods: {
        // 1-鼠标 进入
        // 2-进入后的移动
        // 3-松手
        // 4-还原
        onMouseEnter(e) {
            this.mouseState = 1
            this.mouseStartTime = e.timeStamp
            e.preventDefault()
            e.stopPropagation()
        },
        onMouseMove(e) {
            if (this.mouseState === 1) {
                this.mouseState = 2
            } else if (this.mouseState === 2) {
                let offsetY = 0
                if (this.firstOffsetY) {
                offsetY = e.clientY - this.firstOffsetY
                this.setOffsetY(offsetY)
            } else {
                this.firstOffsetY = e.clientY
            }
            }
            e.preventDefault()
            e.stopPropagation()
        },
        onMouseEnd(e) {
            if (this.mouseState === 2) {
                this.setOffsetY(0)
                this.firstOffsetY = null
                this.mouseState = 3                
            } else {
                this.mouseState = 4         
            }
            const time = e.timeStamp - this.mouseStartTime
            if (time < 150) {
                this.mouseState = 4
            }
            e.preventDefault()
            e.stopPropagation()
        },
        onMaskClick(e) {
            if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)) {
                return
            }
            const offsetX = e.offsetX
            const width = window.innerWidth
            if (offsetX > 0 && offsetX < width * 0.3) {
                this.prevPage()
            } else if (offsetX > 0 && offsetX > width * 0.7) {
                this.nextPage()
            } else {
                this.toggleTitleAndMenu()
            }
        },
        move(e) {
            let offsetY = 0
            if (this.firstOffsetY) {
                offsetY = e.changedTouches[0].clientY - this.firstOffsetY
                this.setOffsetY(offsetY)
            } else {
                this.firstOffsetY = e.changedTouches[0].clientY
            }
            e.preventDefault()
            e.stopPropagation()
        },
        moveEnd(e) {
            this.setOffsetY(0)
            this.firstOffsetY = null
        },
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
            this.book.loaded.navigation.then(nav => {
                // console.log(nav)
                const navItem = flatten(nav.toc)
                function find(item, level = 0) {
                        return !item.parent ? level : find(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
                    }
                    navItem.forEach(item => {
                        item.level = find(item)
                    })
                    this.setNavigation(navItem)
                    // console.log(navItem)
                    // console.log(navigation)
                })
        },
        initEpub() {
            const url = process.env.VUE_APP_RES_URL + '/epub/' + this.fileName + '.epub'
            this.book = new Epub(url)
            this.setCurrentBook(this.book)
            // console.log(this.book)
            this.initRendition()
            // this.initGestrue()
            this.parseBook()
            this.book.ready.then(() => {
                return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
            }).then(locations => {
                this.navigation.forEach(nav => {
                    nav.pagelist = []
                })
                 locations.forEach(item => {
                     const loc = item.match(/\[(.*)\]!/)[1]
                     this.navigation.forEach(nav => {
                         if (nav.href) {
                             const href = nav.href.match(/^(.*)\.html$/)[1]
                             if (href === loc) {
                                 nav.pagelist.push(item)
                             }
                         }
                     })
                 })
                 let currentPage = 1
                 this.navigation.forEach((nav, index) => {
                 if (index === 0) {
                     nav.page = 1
                 } else {
                     nav.page = currentPage
                 }
                 currentPage += nav.pagelist.length + 1
                 })
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
   @import "../../assets/styles/global";
   .ebook-reader {
       width: 100%;
       height: 100%;
       overflow: hidden;
       // background-color: skyblue;
       .ebook-reader-mask {
           position: absolute;
           top: 0;
           left: 0;
           background: transparent;
           z-index: 100;
           width: 100%;
           height: 100%;
       }

   }
</style>
