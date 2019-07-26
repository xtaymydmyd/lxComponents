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

        <div class="default_tip_text" v-html="text" v-if="text"></div>
        <div class="default_tip_text" v-if="!text">
            <span v-if="type == 'content'">暂无内容，去别处逛逛吧〜</span>
            <span v-if="type == 'dynamic'">还没有动态，快去发布吧〜</span>
            <span v-if="type == 'error'">出错啦，快看页面飞走啦〜</span>
            <span v-if="type == 'friend'">还没有好友，赶紧去添加吧〜</span>
            <span v-if="type == 'network'">网络出问题了，快去检查一下吧〜</span>
            <span v-if="type == 'search'">无搜索结果，换个词试试吧〜</span>
            <span v-if="type == 'star'">还没有关注，赶快人去关注一波吧〜</span>
        </div>
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
            default : ''
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
