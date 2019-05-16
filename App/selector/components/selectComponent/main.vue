<template>
    <div class="selectMain flex flex-direction-column">       
        <div class="head_bg nav-header vux-1px-b" style="position:relative;">
            <x-header :left-options="{backText: ''}" :title="title"></x-header>
        </div>
        <div class="container flex-1 overflowYScroll">
            <!-- 部门、岗位、群组列表 -->
            <select-container 
                v-if="mainCondition.length > 0 && mainCondition[mainCondition.length -1].type == 'container'" 
                ref="selectContainerRef"></select-container>
            <!-- 部门及部门人员列表 -->    
            <deptAndMemList 
                v-if="mainCondition.length > 0 && mainCondition[mainCondition.length -1].type == 'depart'" 
                ref="deptAndMemListRef"></deptAndMemList>
            <!-- 岗位及岗位人员列表 -->
            <postAndMenList 
                v-if="mainCondition.length > 0 && mainCondition[mainCondition.length -1].type == 'post'" 
                ref="postAndMenListRef"></postAndMenList>
            <!-- 群组及群组人员列表 -->
            <goupAndMemList 
                v-if="mainCondition.length > 0 && mainCondition[mainCondition.length -1].type == 'group'" 
                ref="goupAndMemListRef"></goupAndMemList>
            <!-- 搜索人员 -->
            <searchMemList 
                v-if="mainCondition.length > 0 && mainCondition[mainCondition.length -1].type == 'search'"
                ref="searchMemListRef"></searchMemList>
        </div>
        <!-- <div class="editGroup" 
            v-if="allowGroupEdit && groupEditFlag && mainCondition.length == 1" 
            @click="checkGroupList()">
            <i class="fa fa-edit"></i>
        </div> -->
        <result ref="resultRef" ></result>
    </div>
</template>

<script>
import bus from 'selector/assets/js/bus.js'

import result from 'selector/components/selectComponent/result.vue'

/* 部门、岗位、群组列表 */
import selectContainer from 'selector/components/selectComponent/selectContainer.vue'
/* 部门 */
import deptAndMemList from 'selector/components/selectComponent/deptAndMemList.vue'
/* 岗位 */
import postAndMenList from 'selector/components/selectComponent/postAndMenList.vue'
/* 群组 */
import goupAndMemList from 'selector/components/selectComponent/goupAndMemList.vue'
/* 搜索结果 */
import searchMemList from 'selector/components/selectComponent/searchMemList.vue'

import { XHeader } from 'vux'
export default {
    name: 'app',
    data(){
        return {
            title: '',
            mainCondition : [],
            query : {},
            activeLevel : 0,
            groupEditFlag : false,
            allowGroupEdit : true,
            oneSelfInfo : {}
        }
    },
    components: {
        result,
        XHeader,
        selectContainer,
        deptAndMemList,
        postAndMenList,
        goupAndMemList,
        searchMemList
    },
    mounted:function () {
        var _this = this;
        bus.$on('changeTitle',function(title){
            _this.title = title;
            common.wxSetTitle(title)
        }.bind(this));

        this.init()
    },
    methods:{
        /**
         * 初始化
        */
        init(){
            var _this = this;
            this.query = this.$route.query;
            this.mainCondition = [{
                title : this.query.title,
                condition : typeof this.query.condition == 'string' ? [this.query.condition] : this.query.condition,
                type : typeof this.query.condition == 'string' ? this.query.condition : 'container',
                deptId : this.query.deptId,
                deptIdList : common.sessionGet("selectionStaffDeptIdList")
            }];
            this.title = this.query.title;
            this.allowGroupEdit = this.query.allowGroupEdit == '0' ? false : true
            this.activeLevel = 0;
            if(this.query.ignoreOneself == 1){
                this.queryOneself();
            }else{
                this.judgeEditGroup();
                this.changeContainer();
            }
        },
        /**
         * 获取我的用户信息
        */
        queryOneself(){
            var url = constGlobal.HostStaffOrg + 'nowUserInfo/search';
            http.apiGet(url).then(res => {
                if (res.status == 0) {
                    if(res.data){
                        this.oneSelfInfo = res.data;
                        this.judgeEditGroup();
                        this.changeContainer();
                    }
                } else {
                    common.toastMsg(res.message)
                }
            });
        },
        /**
         * 判断显示条件
        */
        changeContainer(){
            var _this = this;
            this.$nextTick(function() {
                if(typeof _this.query.condition  == 'string'){
                    switch (_this.query.condition) {
                        case 'depart':
                            var info = _this.mainCondition[_this.mainCondition.length - 1];
                            info.title = "部门";
                            
                            info.withUser =  _this.query.withUser;
                            info.muliteChoice = _this.query.muliteChoice;
                            info.userTypeIdList = _this.query.userTypeIdList;
                            info.ignoreOneself = (_this.query.ignoreOneself || _this.query.ignoreOneself == 1) ? 1 : 0;
                            info.ignoreUserIdList = [this.oneSelfInfo.userId] //忽略人员的id列表
                            info.replace = true;
                            _this.$refs.deptAndMemListRef.init(info);
                            break;
                        case 'post':
                            var info = _this.mainCondition[_this.mainCondition.length - 1];
                            info.title = "岗位";
                            info.withUser =  _this.query.withUser;
                            info.muliteChoice = _this.query.muliteChoice;
                            info.replace = true;
                            _this.$refs.postAndMenListRef.init(info);
                            break;
                        case 'group':
                            var info = _this.mainCondition[_this.mainCondition.length - 1];
                            info.title = "群组";
                            info.withUser =  _this.query.withUser;
                            info.muliteChoice = _this.query.muliteChoice;
                            info.replace = true;
                            _this.$refs.goupAndMemListRef.init(info);
                            break;
                        case 'search':
                            var info = _this.mainCondition[_this.mainCondition.length - 1];
                            info.title = "搜索";
                            info.withUser =  _this.query.withUser;
                            info.muliteChoice = _this.query.muliteChoice;
                            info.replace = true;
                            _this.$refs.searchMemListRef.init(info);
                            break;
                        default:
                    }
                }
            })
        },
        /**
         * 判断是否显示编辑群组的按钮
        */
        judgeEditGroup(){
            for(var i = 0 ; i < this.query.condition.length ; i++){
                if(this.query.condition[i] == 'group'){
                    this.groupEditFlag = true;
                }
            }
        },
        /**
         * 修改等级
        */
        changeLevel(type , param){
            var _this = this;
            if(type == 'add'){
                this.mainCondition.push(param);
                this.activeLevel ++;
            }else{
                this.mainCondition.pop();
                this.activeLevel --;
            }
            this.$refs.resultRef.changeLevel(this.mainCondition.length);
            this.$nextTick(() => {
                switch (_this.mainCondition[_this.mainCondition.length - 1].type) {
                    case 'container':
                        _this.$refs.selectContainerRef.initCondition();
                        break;
                    case 'depart':
                        var info = _this.mainCondition[_this.mainCondition.length - 1];
                        info.withUser =  _this.query.withUser;
                        info.muliteChoice = _this.query.muliteChoice; 
                        info.ignoreOneself = (_this.query.ignoreOneself || _this.query.ignoreOneself == 1) ? 1 : 0;
                        info.ignoreUserIdList = [this.oneSelfInfo.userId] //忽略人员的id列表
                        _this.$refs.deptAndMemListRef.init(info);
                        break;
                    case 'post':
                        var info = _this.mainCondition[_this.mainCondition.length - 1];
                        info.withUser =  _this.query.withUser;
                        info.muliteChoice = _this.query.muliteChoice;
                        _this.$refs.postAndMenListRef.init(info);
                        break;
                    case 'group':
                        var info = _this.mainCondition[_this.mainCondition.length - 1];
                        info.withUser =  _this.query.withUser;
                        info.muliteChoice = _this.query.muliteChoice;
                        _this.$refs.goupAndMemListRef.init(info);
                        break;
                    case 'search':
                        var info = _this.mainCondition[_this.mainCondition.length - 1];
                        info.withUser =  _this.query.withUser;
                        info.muliteChoice = _this.query.muliteChoice;
                        _this.$refs.searchMemListRef.init(info);
                        break;
                    default:
                }
            });
            
        },
        // checkGroupList(){
        //     this.$router.push({
        //         path : '/editGroupList',
        //         query:{
        //             deptId : this.query.deptId,
        //             condition : this.query.condition,
        //             deptIdList : common.sessionGet("selectionStaffDeptIdList")
        //         }
        //     })
        // }
    },
}
</script>

<style lang="scss">
    @import "~selector/assets/css/index.scss";
    @import "~selector/assets/css/condition.scss";
    .selectMain{
        // .editGroup{
        //     position: absolute;
        //     bottom: 150px;
        //     right: 20px;
        //     background: white;
        //     width: 60px;
        //     height: 60px;
        //     text-align: center;
        //     line-height: 60px;
        //     border-radius: 50%;
        //     font-size: 26px;
        //     box-shadow: 1px 2px 10px #dedcdc;
        //     color : $theme;
        // }
    }
</style>
