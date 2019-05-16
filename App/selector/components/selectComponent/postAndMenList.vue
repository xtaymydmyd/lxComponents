<template>
    <div class="selectionStaffList flex flex-direction-column">  
        <div class="flex-1 overflowYScroll selectionStaffContainer">
            <div 
                style="text-align:center;margin:10px 0px 15px 0px;"
                v-if="loading">
                <inline-loading ></inline-loading>&nbsp;加载中
            </div>
            
            <div class="list-wrap ">
                <div class="vux-1px-t" v-show="postList.length > 0 || userList.length > 0"></div>
                <!-- 岗位列表 -->
                <div class="list flex flex-align-items vux-1px-b" 
                    v-for="(item , index) in postList" 
                    :key="item.id" 
                    v-if="postList.length > 0"
                    >
                    <div class="select-left" 
                        @click="changePostSelect('post' , index)"
                        v-if="muliteChoice != 2">
                        <i class="weui-icon weui_icon_circle weui-icon-circle" :class="{ 'weui_icon_success weui-icon-success' : item.selected , ' weui_icon_circle weui-icon-circle' : !item.selected}" style="" ></i>
                    </div>
                    <div class="flex flex-1 flex-align-items" @click="toModule(item , index)">
                        <div class="left">
                            <i class="fa fa-folder-open"></i>
                        </div>
                        <div class="name flex-1 textLineClamb1">{{item.name}} ({{item.userIdList.length}})</div>
                        <div class="arrow">
                            <x-icon type="ios-arrow-right" size="15"></x-icon>
                        </div>
                    </div>
                </div>
                <!-- 岗位人员列表 -->
                <div class="list flex flex-align-items vux-1px-b" 
                    v-for="(item , index) in userList" 
                    :key="item.id" 
                    v-if="userList.length > 0"
                    >
                    <div class="select-left" @click="changePostSelect('user' , index)">
                        <i class="weui-icon weui_icon_circle weui-icon-circle" 
                            :class="{ 'weui_icon_success weui-icon-success' : item.selected , ' weui_icon_circle weui-icon-circle' : !item.selected}" style="" ></i>
                    </div>
                    <div class="flex flex-1 flex-align-items">
                        <div class="left flex flex-align-items">
                            <img src="~selector/assets/img/headmr.png" class="icon" style="width:100%;height:100%;" v-if="item.headImgUrl == null || item.headImgUrl == ''">
                            <img :src="HostSource + item.headImgUrl" class="icon headImg" style="width:100%;height:100%;" v-if="!(item.headImgUrl == null || item.headImgUrl == '')">
                        </div> 
                        <div class="name flex-1 ">{{item.name}}</div>
                    </div>
                </div>
                 <no-data-tip 
                    :msg="msg" 
                    :showFlag="nodataFlag" 
                    top="80"></no-data-tip>
            </div>
        </div>
       
    </div>
</template>

<script>
import bus from 'selector/assets/js/bus.js'
import { XHeader , Group , Cell ,InlineLoading } from 'vux'
import noDataTip from 'selector/components/NoDataTip/NoDataTip.vue'
export default {
    name: 'app',
     data(){
        return {
            msg : '',
            type : '',
            deptId : '',
            userIds : [],
            userList : [], //人员列表
            postList : [],
            withUser : 1, //是否查询用户  1：查询用户，2:不查询用户
            loading : true, //加载中
            title : "选择",
            muliteChoice : 1,
            deptLoading : false,
            nodataFlag : false, //暂无数据
            HostSource : constGlobal.HostSource,
            deptIdList : []
        }
    },
    components: {
        XHeader,
        Group,
        Cell,
        noDataTip,
        InlineLoading
    },
    mounted:function () {
        bus.$on('changeSelectInfo', function(param) {
            this.updatSelectStatus(param)
        }.bind(this)) 
    },
    methods:{
        init(param){
            this.type = param.type;
            this.deptId = param.deptId;
            this.deptIdList = param.deptIdList;
            this.withUser = param.withUser;
            this.muliteChoice = param.muliteChoice;

            this.$nextTick(function() {
                bus.$emit("changeTitle", param.title);
            })

            //初始化数据
            this.nodataFlag = false
            this.postList = [];
            this.userList = [];

            if(!param.selectMem){ //获取岗位列表
                this.queryPostList();
            }else{ //获取岗位下人员列表
                this.userIds = param.userIdList;
                this.queryUserAccordionIds();
            }
        },
        /**
         * 根据ids获取用户详情
        */
        queryUserAccordionIds(){
            this.loading = true;
            var url = constGlobal.HostStaffOrg + 'userBaseInfo/search';
            var param = {
                ids : this.userIds,
            }
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                    this.loading = false;
                    if(res.data.length > 0){
                        this.userList = res.data;
                        this.userList.forEach(item => {
                            item.selected = false;
                        })
                        this.judgeUserSelect();
                    }else{
                        this.msg = '未查询人员信息';
                        this.nodataFlag = true;
                    }
                } else {
                    common.toastMsg(res.message)
                }
            });
        },
        /**
         * 判断人员是否被选中
        */
        judgeUserSelect(){
            var list = common.sessionGet("selectionStaffUserListEdit");
            if(!list){
                list = this.$parent.$refs.resultRef.userList;
            }
            for(var i = 0 ; i < this.userList.length ; i++){
                var flag = false;
                for(var j = 0 ; j < list.length ; j++){
                    if(this.userList[i].id == list[j].id){
                        flag = true;
                        break;
                    }
                }
                if(j < list.length && flag){
                    this.userList[i].selected = true;
                }
            }
        },
        /**
         * 获取岗位列表
        */
        queryPostList(){
            this.loading = true;
            var url = constGlobal.HostStaffOrg + 'postInfoAndUserByDeptId/search';
            if( !this.deptId ){
                this.nodataFlag = true;
                this.msg = '出错啦';
                return 
            }
            var param = {
                deptId : this.deptId,
                deptIdList : this.deptIdList ,
                withUser : this.withUser //0不查询用户
            }
            http.apiPost( url , param ).then(res => {
                if (res.status == 0) {
                    this.loading = false;
                    if(res.data.length > 0){
                        this.postList = res.data;
                        this.initPostInfo();
                    }else{
                        this.nodataFlag = true;
                        this.msg = '未查询岗位信息';
                    }
                } else {
                    common.toastMsg(res.message)
                }
            });
        },
        /**
         * 初始化岗位信息
        */
        initPostInfo(){
            this.postList.forEach( item => {
                item.selected = false;
            })
            this.initSelected();
        },
        /**
         * 初始化页面选择
        */
        initSelected(){
            var userList = common.sessionGet("selectionStaffUserListEdit");
            if(!userList){
                userList = this.$parent.$refs.resultRef.userList;
            }
            this.judgePostSelect(userList)
        },
        /**
         * 判断人员是否被选中
        */
        determineUserSelectStatus(){
            var userList = this.$parent.$refs.resultRef.userList;
            if(userList.length == 0){
                return;
            }
            for(var i = 0 ; i < userList.length ; i++){
                for(var j = 0 ; j < this.userList.length ; j++){
                    if(userList[i].id == this.userList[j].id){
                        this.userList[j].selected = true;
                    }
                }
            }
        },
        /**
         * 删除用户并修改相关状态
        */
        updatSelectStatus(param){
            if(this.postList.length == 0){
                return;
            }
            for(var i = 0 ; i < this.postList.length ; i++){
                for(var j = 0 ; j < this.postList[i].userIdList.length ; j++){
                    if(param.id == this.postList[i].userIdList[j]){
                        this.postList[i].selected = false;
                        this.postList.push();
                        return;
                    }
                }
            }
        },
        /**
         * 判断岗位是否被选中
        */
        judgePostSelect(list){
            for(var i = 0 ; i < this.postList.length ; i++){
                for(var j = 0 ; j < this.postList[i].userIdList.length ; j++){
                    for(var k = 0 ; k < list.length ; k++){
                        if(this.postList[i].userIdList[j] == list[k].id){
                            break;
                        }
                    }
                    if(k == list.length){
                        this.postList[i].selected = false;
                        break;
                    }
                }
                if(j == this.postList[i].userIdList.length && this.postList[i].userIdList.length > 0){
                    this.postList[i].selected = true;
                }
            }
        },
        /**
         * 点击岗位查询岗位下的人员信息
        */
        toModule(item , index){
            var param = {
                title : item.name,
                type : 'post',
                selectMem : true,
                userIdList : item.userIdList          
            }
            this.$parent.changeLevel('add' , param);
        },
        changePostSelect(type , index){
            switch (type) {
                case 'post':
                    this.postList[index].selected = !this.postList[index].selected;
                    this.postList.push();
                    this.queryPostMemList(this.postList[index].userIdList , this.postList[index].selected)
                    break;
                case 'user':
                    this.selectStaffFromUser(this.userList[index] , index);
                    break;
                default:
                    console.log("default")
            }
        },
        /**
         * 选择或取消选择人员
        */
        selectStaffFromUser(info , index){
            if(this.muliteChoice == 2){
                this.clearSelectStaffSelect(info);
            }
            this.userList[index].selected = !this.userList[index].selected;
            this.userList.push();
            var param = {
                userList : [ info ],
                type : this.userList[index].selected
            }
            bus.$emit('operaStaff' , param) 
        },
        /**
         * 选择或取消选择岗位
        */
        queryPostMemList(ids , status){
            var url = constGlobal.HostStaffOrg + 'userBaseInfo/search';
            var param = {
                ids : ids,
            }
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                    if(res.data.length > 0){
                        var param = {
                            userList : res.data,
                            type : status
                        }
                        bus.$emit('operaStaff' , param) 
                    }
                } else {
                    common.toastMsg(res.message)
                }
            });
        },
        /**
         * 清队已选择人中
        */
        clearSelectStaffSelect(info){
            this.userList.forEach(item => {
                if(item.selected && item.id != info.id){
                    item.selected = false;
                }
            })
        }
    },
}
</script>
<style lang="scss">
    @import "~selector/assets/css/selection.scss";
   
</style>


