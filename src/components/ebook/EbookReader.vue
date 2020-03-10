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
