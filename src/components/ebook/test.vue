<template>
   <div v-bind:style="[styleColor, styleSize]">
       </div> 
</template>
<script>
export default {
    props: ['styleWay'],
    computed: {
        normalizedSize: function() {
            return this.styleWay.trim().toLowerCase()
        }
    },
    data: function() {
        return {
            counter: this.styleWay,
            styleColor: {
                color: 'red'
            },
            styleSize: {
                fontSize: '23px'
            }
        }
    }
}
</script>
<style lang="">
    
</style>