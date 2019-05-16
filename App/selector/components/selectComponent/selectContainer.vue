<template>
    <div class="conditionIndex flex flex-direction-column">  
        <div class="searchWrap">
            <search
                v-model="searchStaffName"
                placeholder="搜索"
                cancelText = "取消"
                position="absolute"
                @on-focus="toSearch()"
                ref="search"></search>
        </div>
        <div class="flex-1 overflowYScroll">
            <div class="list-wrap vux-1px-t">
                <div class="list flex flex-align-items" 
                    style="border-bottom:1px solid #e6e6e6;"
                    v-for="(item , index) in conditionList" 
                    :key="index" 
                    @click="toModule(index)"
                    v-if="item.show">
                    <div class="left">
                        <i class="fa fa-folder-open"></i>
                    </div>
                    <div class="name flex-1 ">{{item.title}}</div>
                    <div class="arrow">
                        <x-icon type="ios-arrow-right" size="15"></x-icon>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Group , Cell , Search } from 'vux'
export default {
    name: 'app',
     data(){
        return {
            searchStaffName : '',
            title : "",
            query : {},
            conditionList : [{
                title : '部门',
                link : '/selectionStaffList',
                type : 'depart',
                icon : '',
                id : '1',
                show : false
            },{
                id : '1',
                title : '岗位',
                link : '/selectionStaffList',
                type : 'post',
                show : false
            },{
                title : '群组',
                link : '/groupList',
                type : 'group',
                show : false
            }],
            selectionStaffCondition : common.sessionGet("selectionStaff")
        }
    },
    components: {
        Group,
        Cell,
        Search
    },
    mounted:function () {
        var _this = this;
        this.query = this.$route.query;
       
        this.initCondition();
    },
    methods:{
        initCondition(){
            this.$parent.title = this.query.title;
            common.wxSetTitle(this.query.title)
            if(typeof(this.query.condition) == 'string'){
                for(var i = 0 ; i < this.conditionList.length ; i++){
                    if(this.conditionList[i].type == this.query.condition){
                        this.conditionList[i].show = true;
                    }
                }
            }else{
                for(var i = 0 ; i < this.conditionList.length ; i++){
                    for(var j = 0 ; j < this.query.condition.length ; j++){
                        if(this.conditionList[i].type == this.query.condition[j]){
                            this.conditionList[i].show = true;
                        }
                    }
                }
            }
            sessionStorage.removeItem('selectionStaffDeptInfo');
        },
        toModule(index){
            var param = {
                title : this.conditionList[index].title,
                type : this.conditionList[index].type,
                deptId : this.query.deptId,
                deptIdList : common.sessionGet("selectionStaffDeptIdList")
            }
            this.$parent.changeLevel('add' , param);
        },
        /**
         * 跳转到搜索页面
        */
        toSearch(){
            var param = {
                title : '搜索人员',
                type : 'search',
                deptId : this.query.deptId,
                deptIdList : common.sessionGet("selectionStaffDeptIdList")
            }
            this.$parent.changeLevel('add' , param);
        }
    }
}
</script>

<style lang="scss">
    @import "~selector/assets/css/condition.scss";
    .group-edit-icon{
        padding: 12px 13px; 
        position: fixed; 
        bottom: 100px; 
        right: 50px; 
        background: white; 
        border-radius: 50%; 
        border: 1px solid #eaeaea; 
        box-shadow: 0px 1px 2px #eaeaea;
        img{
            width: 26px;
        }
    }
</style>