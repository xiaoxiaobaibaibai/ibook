<template>
    <div class="ebook-reader">
        <div id="read">
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Epub from 'epubjs'
global.ePub = Epub
export default {
    computed: {
        ...mapGetters(['fileName'])
    },
    methods: {
        prevPage() {
            if (this.rendition) {
                this.rendition.prev()
            }
        },
        nextPage() {
            if (this.rendition) {
                this.rendition.next()
            }
        },
        toggleTitleAndMenu() {},
        initEpub() {
            const url = 'http://localhost:8081/epub/' + this.fileName + '.epub'
            this.book = new Epub(url)
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
        const fileName = this.$route.params.fileName.split('|').join('/')
        this.$store.dispatch('setFileName', fileName).then(() => {
            this.initEpub()
        })
        }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
   @import "../../assets/styles/global"
</style>
