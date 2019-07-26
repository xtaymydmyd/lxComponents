<template>
    <div id="default_tip" class="default_tip flex flex-direction-column flex-align-items flex-justify-content"
        v-show="value">
        <img src="./img/default_ content.jpg" alt="" class="default_tip_img" v-if="type == 'content'">
        <img src="./img/default_ dynamic.jpg" alt="" class="default_tip_img" v-if="type == 'dynamic'">
        <img src="./img/default_error.jpg" alt="" class="default_tip_img" v-if="type == 'error'">
        <img src="./img/default_friend.jpg" alt="" class="default_tip_img" v-if="type == 'friend'">
        <img src="./img/default_network.jpg" alt="" class="default_tip_img" v-if="type == 'network'">
        <img src="./img/default_star.jpg" alt="" class="default_tip_img" v-if="type == 'star'">
        <img src="./img/default_search.jpg" alt="" class="default_tip_img" v-if="type == 'search'">

        <div class="default_tip_text" v-html="text"></div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name:'defaultTip',
    data(){
       return {

        }
    },
    props: {
        value : {
            type : Boolean,
            default : false
        },
        text : {
            type : String,
            default : '暂无数据'
        },
        type : {
            type : String,
            default : 'content'
        }
    },
    components: {

    },
    mounted:function () {

    },
    methods:{

    }
}
</script>

<style lang='scss'>
@import '~assets/css/flexComp.scss';
.default_tip{
    min-height:100%;
    background:#fff;

    .default_tip_img{
        width:100%;
        margin-top: -30%;
    }
    .default_tip_text{
        color:rgb(102,102,102);
        font-size:18px;
        padding: 0px 15px;
        word-break: break-word;
    }
}
</style>
