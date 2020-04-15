<template>
    <div class="ebook-bookmark" ref="bookmark">
        <div class="ebook-bookmark-text-wrapper">
            <div class="ebook-bookmark-down-wrapper" ref="iconDown">
                <span class="icon-down"></span>                
            </div>
            <div class="ebook-bookmark-text">{{text}}</div>
        </div>
        <div class="ebook-bookmark-icon-wrapper" 
             :style="fixed ? fixedStyle : {}">
            <bookmark :color="color" :width="15" :height="35"></bookmark>
        </div>
    </div>
</template>
<script>
import Bookmark from '../common/Bookmark'
import { realPx } from '../../utils/utils'
import { ebookMixin } from '../../utils/mixin'
const BLUE = '#346cbc'
const WHITE = '#fff'
export default {
    mixins: [ebookMixin],
    components: {
        Bookmark
    },
    computed: {
        height() {
            return realPx(35)
        },
        threshold() {
            return realPx(55)
        },
        fixedStyle() {
            return {
                position: 'fixed',
                top: 0,
                right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`
            }
        }
    },
    watch: {
        offsetY(v) {
          if (!this.bookAvailable || this.menuVisible || this.settingVisible >= 0) {
            return
          }
            if (v >= this.height && v <= this.threshold) {
              this.beforeThreshold(v)
            } else if (v >= this.threshold) {
              this.afterThreshold(v)
            } else if (v > 0 && v < this.height) {          
              this.beforeHeight()
            } else if (v === 0) {
              this.restore()
            }
      }
      // offsetY(v)
        // if (this.settingVisible > 0 || this.menuVisible || this.isPaginating) {
        //   return
        // }
        // if (v >= this.height && v < this.threshold) {
        //   this.setBookmark = false
        //   this.$refs.ebookBookmark.style.top = `${-v}px`
        //   if (this.$refs.iconDown.style.transform === 'rotate(180deg)') {
        //     this.$refs.iconDown.style.transform = 'rotate(0deg)'
        //   }
        //   if (!this.isBookmark) {
        //     this.text = this.$t('book.pulldownAddMark')
        //     this.color = WHITE
        //   } else {
        //     this.text = this.$t('book.pulldownDeleteMark')
        //     this.color = BLUE
        //   }
        // } else if (v >= this.threshold) {
        //   this.setBookmark = true
        //   this.$refs.ebookBookmark.style.top = `${-v}px`
        //   if (this.$refs.iconDown.style.transform === 'rotate(0deg)' ||
        //     this.$refs.iconDown.style.transform === '') {
        //     this.$refs.iconDown.style.transform = 'rotate(180deg)'
        //   }
        //   if (!this.isBookmark) {
        //     this.text = this.$t('book.releaseAddMark')
        //     this.color = BLUE
        //   } else {
        //     this.text = this.$t('book.releaseDeleteMark')
        //     this.color = WHITE
        //   }
        // } else if (v > 0 && v < this.height) {
        //   this.setBookmark = false
        //   if (!this.isBookmark) {
        //     this.text = this.$t('book.pulldownAddMark')
        //   } else {
        //     this.text = this.$t('book.pulldownDeleteMark')
        //   }
        // } else if (v === 0) {
        //   if (!this.isBookmark) {
        //     if (this.setBookmark) {
        //       this.fixed = true
        //       this.setAndSaveBookmark()
        //     } else {
        //       this.fixed = false
        //     }
        //   } else {
        //     if (this.setBookmark) {
        //       this.fixed = false
        //       this.removeBookmark()
        //     } else {
        //       this.fixed = true
        //     }
        //   }
        //   setTimeout(() => {
        //     this.$refs.ebookBookmark.style.top = `${-this.height}px`
        //     this.$refs.iconDown.style.transform = 'rotate(0deg)'
        //     if (!this.fixed && this.color === BLUE) {
        //       this.color = WHITE
        //     }
        //     if (this.text === this.$t('book.releaseAddMark')) {
        //       this.text = this.$t('book.pulldownAddMark')
        //     }
        //     this.setBookmark = false
        //   }, 200)
        // }
      
    },
    data() {
        return {
            text: '',
            color: WHITE,
            fixed: false,
            setBookmark: false
        }
    },
    methods: {
      addBookmark() {},
      removeBookmark() {},
      beforeHeight() {
        // 状态一 未达到指定高度
        if (this.isBookmark) {
                this.text = this.$t('book.pulldownDeleteMark')
                this.color = BLUE
                this.fixed = true
              } else {
                this.text = this.$t('book.pulldownAddMark')
                this.color = WHITE
                this.fixed = false
              }
        this.fixed = false
      },
      beforeThreshold (v) {
        // 状态二 未到达临界状态
              //console.log('daodao')
              this.$refs.bookmark.style.top = `${-v}px`
              this.beforeHeight()
              const iconDown = this.$refs.iconDown
              if (iconDown.style.transform === 'rotate(180deg)') {
                iconDown.style.transform = 'rotate(0deg)'
              }
      },
      afterThreshold(v) {
              // 状态三 超越临界状态
              this.$refs.bookmark.style.top = `${-v}px`
              if (this.isBookmark) {
                this.text = this.$t('book.releaseDeleteMark')
                this.color = WHITE
                this.fixed = false
              } else {
                this.text = this.$t('book.releaseAddMark')
                this.color = BLUE
                this.fixed = true
              }
              const iconDown = this.$refs.iconDown
              if (iconDown.style.transform === '' || iconDown.style.transform === 'rotate(0deg)') {
                iconDown.style.transform = 'rotate(180deg)'
              }
      },
      restore() {
        // 状态四 归位
        setTimeout(() => {
        this.$refs.bookmark.style.top = `${-this.height}px`
        this.$refs.iconDown.style.transform = 'rotate(0deg)'
        }, 200)
        if (this.fixed) {
          this.setIsBookmark(true)
          this.addBookmark()
        } else {
          this.setIsBookmark(false)
          this.removeBookmark()
        }
      }
    }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
   @import "../../assets/styles/global";
   .ebook-bookmark {
       position: absolute;
       top: px2rem(-35);
       left: 0;
       z-index: 200;
       width: 100%;
       height: px2rem(35);
       .ebook-bookmark-text-wrapper {
           position: absolute;
           right: px2rem(45);
           bottom: 0;
           display: flex;
           .ebook-bookmark-down-wrapper {
               font-size: px2rem(14);
               color: white;
               transition: all .2s linear;
               @include center;
           }
           .ebook-bookmark-text {
               font-size: px2rem(14);
               color: white;
           }
       }
       .ebook-bookmark-icon-wrapper {
           position: absolute;
           right: 0;
           bottom: 0;
           margin-right: px2rem(10);           
   }}
</style>
