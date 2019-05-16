<template>
    <div class="index flex flex-direction-column">       
        <select-main></select-main>
    </div>
</template>

<script>
import selectMain from 'selector/components/selectComponent/main.vue'
export default {
    components: {
        selectMain
    },
}
</script>

<style lang="scss">
    .index{
        width:100%;
        height:100%;
        
    }
</style>
