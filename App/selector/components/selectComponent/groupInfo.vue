<template>
    <div class="groupInfo flex flex-direction-column">  
        <div class="head_bg nav-header" >
            <x-header :left-options="{backText: ''}" :title="query.readonly ? '群组信息' : '编辑群组'"></x-header>
        </div>
        <div class="flex-1 overflowYScroll selectionStaffContainer">
            <div class="list-wrap ">
                 <group class="groupName">
                    <x-input 
                        title="群组名称" 
                        placeholder="请输入群组名称" 
                        :show-clear="false" 
                        placeholder-align="right"
                        v-model="groupInfo.name"
                        :disabled = query.readonly></x-input>
                </group>
                <div class="list flex flex-align-items" style="padding:15px 15px;" >
                    <div class="name flex-1 textLineClamb1">群成员</div>
                    <div class="add-group-mem" @click="addGroupMem()" v-if="!query.readonly">添加群组成员</div>
                </div>
                <swipeout>
                    <swipeout-item transition-mode="follow" 
                        :disabled="query.readonly"
                        v-for="(item , index) in groupInfo.memberList" 
                        :key="item.id" 
                        >
                        <div slot="content" class="list flex flex-align-items" @click="selectMem(index)">
                            <div class="flex flex-1 flex-align-items">
                                <div class="select-left" v-if="!query.readonly">
                                    <i class="weui-icon weui_icon_circle weui-icon-circle" 
                                        :class="{ 'weui_icon_success weui-icon-success' : item.selected , ' weui_icon_circle weui-icon-circle' : !item.selected }" style="" ></i>
                                </div>
                                <div class="left flex flex-align-items">
                                    <!-- <img src="~selector/assets/img/headmr.png" class="icon" > -->
                                    <img src="~selector/assets/img/headmr.png" class="icon" v-if="item.headImgUrl == null || item.headImgUrl == ''">
                                    <img :src="HostSource + item.headImgUrl" class="icon" v-if="!(item.headImgUrl == null || item.headImgUrl == '')">
                                </div> 
                                <div class="name flex-1 textLineClamb1">{{item.name}}</div>
                            </div>
                            <div class="deptName">{{item.deptName}}</div>
                        </div>
                        <div slot="right-menu" >
                            <swipeout-button type="warn" @click.native="deleteData(item , index)">删除</swipeout-button>
                        </div>
                    </swipeout-item>
                </swipeout>
            </div>
        </div>

        <div class="opera-wrap flex" v-if="!query.readonly">
            <div class="deleteBtn" v-show="deleteList.length > 0" @click="deleteData()">删除( {{deleteList.length}} )</div>
            <div class="saveBtn flex-1"  @click="save()" >保存</div>
        </div>
    </div> 
</template>

<script>
import bus from 'selector/assets/js/bus.js'
import selectMethod from 'selector/assets/js/select.js'
import { XHeader , Group , Confirm , Cell , XInput ,InlineLoading , Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
import noDataTip from 'selector/components/NoDataTip/NoDataTip.vue'
export default {
    name: 'app',
     data(){
        return {
            deleteModel : false,
            groupInfo : {
                name : '',
                memberList : []
            },
            deleteList : [],
            title : '',
            type : '',
            withUser : '',
            muliteChoice : '',
            editStatus : true,
            query : {
                type : '',
                readonly : false
            },
            memberList : [],
            HostSource : constGlobal.HostSource
        }
    },
    components: {
        Cell,
        Group,
        XInput,
        Confirm,
        XHeader,
        noDataTip,
        InlineLoading,
        Swipeout,
        SwipeoutItem,
        SwipeoutButton
    },
    mounted:function () {
        var _this = this;
        var userList = [];
        this.query = this.$route.query;
        this.query.readonly = this.$route.query.readonly == '1' ? true : false;
        if(this.query.type == 'edit'){
            this.queryGroupInfo();
        }else{
            var groupInfo = common.sessionGet("groupInfo");
            this.callBackEvent();
        }
        
    },
    methods:{
        /**
         * 获取群组信息
        */
        queryGroupInfo(){
            var url = constGlobal.HostStaffOrg + 'groupInfoAndUserList/search?groupId=' + this.query.groupId;
            http.apiGet(url).then(res => {
                if (res.status == 0) {
                    if(res.data){
                        this.groupInfo = res.data;
                        this.callBackEvent();
                    }
                } else {
                    common.toastMsg(res.message)
                }
            });
        },
        /**
         * 选择人员后回调方法
        */
        callBackEvent(){
            var userList = [];
            var groupInfo ;
            if(selectMethod.isFromSelectStaff()){
                groupInfo = common.sessionGet("groupInfo");
                userList = selectMethod.getResult();
                this.groupInfo.memberList = []
                for(var i = 0 ; i < userList.length ; i++){
                    var param = {
                        id : userList[i].id,
                        name :userList[i].name
                    }
                    this.groupInfo.memberList.push(param);
                }
            }
            // if(groupInfo){
            //     this.groupInfo.name = groupInfo.name;
            // }
            for(var i = 0 ; i < this.groupInfo.memberList.length ; i++){
                this.groupInfo.memberList[i].selected = false;
            }
        },
        /**
         * 保存群组信息
        */
        save(){
            if(this.groupInfo.name.length == 0){
                common.toastMsg("请输入群组名称");
                return;
            }else if(this.groupInfo.memberList.length == 0){
                common.toastMsg("请选择群组成员");
                return;
            }
            if(this.query.type == 'edit'){
                this.updateGroupInfo(1);
            }else{
                this.saveGroupInfo();
            }
        },
        /**
         * 保存群组信息
        */
        saveGroupInfo(){
            var memberList = [];
            for(var i = 0 ; i < this.groupInfo.memberList.length ; i++){
                memberList.push(this.groupInfo.memberList[i].id);
            }
            var url = constGlobal.HostStaffOrg + 'groupInfo/create';
            var param = {
                name : this.groupInfo.name,
                memberList : memberList
            }
            http.apiPost(url , param).then(res => {
                if (res.status == 0) {
                    if(res.data){
                        this.$router.replace({ 
                            name : 'editGroupList',
                            path : '/editGroupList', 
                            query:{
                                deptId : this.query.deptId,
                                condition : this.query.condition
                            }
                        });
                    //    var queryStr = 'deptId=' + this.query.deptId;
                    //     for (var i = 0; i < this.query.condition.length; i++) {
                    //         queryStr += 'condition=' + this.query.condition[i];
                    //         if(i < (this.query.condition.length - 1)){
                    //             queryStr += '&'
                    //         }
                    //     }
                    //     window.location.replace("select.html#/?" + queryStr)
                    }
                } else {
                    common.toastMsg(res.message)
                }
            });
        },
        /**
         * 更新群组信息
        */
        updateGroupInfo(type){
            if(this.query.readonly){
                return;
            }
            var memberList = [];
            for(var i = 0 ; i < this.groupInfo.memberList.length ; i++){
                memberList.push(this.groupInfo.memberList[i].id);
            }
            var url = constGlobal.HostStaffOrg + 'groupInfo/update';
            var param = {
                groupId : this.groupInfo.groupId,
                name : this.groupInfo.name,
                memberList : memberList
            }
            http.apiPost(url , param).then(res => {
                if (res.status == 0) {
                    if(res.data){
                        if(type == 1){
                            this.$router.replace({ 
                                name : 'editGroupList',
                                path : '/editGroupList', 
                                query:{
                                    deptId : this.query.deptId,
                                    condition : this.query.condition
                                }
                            });
                        }
                    }
                } else {
                    common.toastMsg(res.message)
                }
            });
        },
        selectMem(index){
            if(this.query.readonly){
                return;
            }
            this.groupInfo.memberList[index].selected = !this.groupInfo.memberList[index].selected;
            if(this.groupInfo.memberList[index].selected){
                this.deleteList.push(this.groupInfo.memberList[index].id)
            }else{
                for(var i = 0 ; i < this.deleteList.length ; i++){
                    if(this.groupInfo.memberList[index].id == this.deleteList[i]){
                        this.deleteList.splice(i , 1);
                    }
                }
            }
        },
        /**
         * 打开删除人员对话框
        */
        deleteData(){
           
            var deleteIds = [];
            var _this = this;
            for(var i = 0 ; i < this.deleteList.length ; i++){
                deleteIds.push(this.deleteList[i].id);
            }
            this.$vux.confirm.show({
                title: '删除提示',
                content: '是否删除群组人员？',
                confirmText : '确认',
                cancelText : '取消',
                onCancel () { },
                onConfirm () {
                    var url = constGlobal.HostStaffOrg + 'groupMember/delete';
                    var param = {
                        groupId : _this.groupInfo.groupId,
                        userIdList : deleteIds
                    }
                    http.apiPost(url , param).then(res => {
                        if (res.status == 0) {
                            _this.deleteList = [];
                            _this.queryGroupInfo()
                        } else {
                            common.toastMsg(res.message)
                        }
                    });
                }
            })
        },
        /**
         * 确认删除群组
        */
        onConfirmDelete(){

        },
        /**
         * 添加群组成员
        */
        addGroupMem(){
            if(this.query.readonly){
                return;
            }
            if(this.query.type != 'edit'){
                common.sessionSet("groupInfo",this.groupInfo)
            }
            var memList = []
            for(var i = 0 ; i < this.groupInfo.memberList.length ; i++){
                var param = {
                    name : this.groupInfo.memberList[i].name,
                    id : this.groupInfo.memberList[i].id
                }
                memList.push(param);
            }
            var param = { 
                deptId : this.query.deptId,//父部门id 
                deptIdList : common.sessionGet("selectionStaffDeptIdList"),
                withUser : 1, //是否查询用户  1：查询用户，2:不查询用户
                muliteChoice : 1,//是否多选人员 1 ：多选  2：单选
                title : '选择群组成员',//标题
                userTypeIdList : [], //用户类型列表
                condition : this.query.condition,
                userList : memList,
                callbackUrl : 'select.html' + window.location.hash,
                allowGroupEdit : 0
            }
            selectMethod.toSelect(param);  
        }
    },
}
</script>
<style lang="scss">
    @import "~selector/assets/css/public.scss";
    @import "~selector/assets/css/selection.scss";
    .groupInfo{
        width:100%;
        height:100%;
        color:#333;
        .vux-header .vux-header-left, .vux-header .vux-header-right{
            color : $font_color_blue;
        }
        .groupName{
            .weui-cells{
                margin-top:0px;
            }
            margin-top:0px;
            margin-bottom:10px;
            .weui-cell{
                padding:16px 15px;
                .weui-input{
                    text-align:right;
                }
            }
        }
        .list-wrap{
            .list{
                border-bottom:1px solid #e6e6e6;
                background:white;
                padding: 10px 15px;
                .left{
                    width:40px;
                    .icon{
                        width:30px;
                        height:30px;
                    }
                }
                .select-left{
                    width:40px;
                    img{
                        width:20px;
                    }
                }
                .name{
                    color : rgb(51,51,51);
                }
                .deptName{
                    color : rgb(102,102,102);
                }
            }
           
        }
        .add-group{
            height: 50px;
            line-height: 50px;
            background: white;
            color: $font_color_blue;
            text-align:center;
            text-align:center;
            .vux-x-icon {
                fill: $font_color_blue;
            }
        }
        .saveBtn{
            background:$theme;
            height:50px;
            line-height:50px;
            color:white;
            text-align:center;
            font-size:16px;
            outline: none;
        }
        .deleteBtn{
            color : $theme;
            height:50px;
            line-height:50px;
            text-align:center;
            font-size:16px;
            outline: none;
            width:50%;
            background:white;
        }
        .add-group-mem{
            color : $font_color_blue;
        }
        .readonly{
            color : rgba(0,0,0,0.4);
        }
        .readonlyBtn{
            color: rgba(0, 0, 0, 0.3);
            background-color: #F7F7F7;
        }
        input:disabled{
            color: rgba(0, 0, 0, 0.4);
        }
    }
    
</style>


