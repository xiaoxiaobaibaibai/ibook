<template>
    <div class="ebook-reader">
        <div id="read">
        </div>
    </div>
</template>

<script>
import Epub from 'epubjs'
import { ebookMixin } from '@/utils/mixin.js'

global.ePub = Epub
export default {
    mixins: [ebookMixin],
    methods: {
        prevPage() {
            if (this.rendition) {
                this.rendition.prev()
                this.hideTitleAndMenu()
            }
        },
        nextPage() {
            if (this.rendition) {
                this.rendition.next()
                this.hideTitleAndMenu()
            }
        },
        toggleTitleAndMenu() {
            //this.$store.dispatch('setMenuVisible', !this.menuVisible)
            if (this.menuVisible) {
                this.setSettingVisible(-1)
            }
            this.setMenuVisible(!this.menuVisible)
        },
        hideTitleAndMenu() {
           // this.$store.dispatch('setMenuVisible', false)
            this.setMenuVisible(false)
            this.setSettingVisible(-1)
        },
        initEpub() {
            const url = 'http://localhost:8081/epub/' + this.fileName + '.epub'
            this.book = new Epub(url)
            this.setCurrentBook(this.book)
            // console.log(this.book)
            this.rendition = this.book.renderTo('read', {
                width: innerWidth,
                height: innerHeight,
                methods: 'default' // 微信的兼容性配置
            })
            this.rendition.display()
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
