<template>
    <div class="selectionStaffList flex flex-direction-column">  
        <div class="flex-1 overflowYScroll selectionStaffContainer">
            <div class="list-wrap ">
                <div class="vux-1px-t" v-show="groupList.length > 0 || memberList.length > 0"></div>
                <div 
                    style="text-align:center;margin:10px 0px 15px 0px;"
                    v-if="loading">
                    <inline-loading ></inline-loading>&nbsp;加载中
                </div>
                <div  
                    v-for="(item , index) in groupList" 
                    :key="item.id" 
                    v-show="groupList.length > 0"
                    >
                    <div class="list flex flex-align-items" >
                        <div class="flex flex-1 flex-align-items">
                            <div class="select-left" v-if="muliteChoice != 2" @click="selectGroup(index)">
                                <i class="weui-icon weui_icon_circle weui-icon-circle" 
                                    :class="{ 'weui_icon_success weui-icon-success' : item.selected , ' weui_icon_circle weui-icon-circle' : !item.selected}" style="" ></i>
                            </div>
                            <div class="info flex flex-1 flex-align-items" @click="toModule(item)">
                                <div class="left">
                                    <i class="fa fa-folder-open"></i>
                                </div>
                                <div class="name flex-1 textLineClamb1">{{item.name}}</div>
                                <div class="arrow">
                                    <x-icon type="ios-arrow-right" size="15"></x-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 人员列表 -->
                <div
                    class="list"
                    v-for="(item , index) in memberList" :key="index" @click="selectStaffFromUser(item , index)">
                    <div class="scan-empower-list flex">
                        <div class="select-left flex flex-align-items">
                            <i class="weui-icon weui_icon_circle weui-icon-circle" :class="{ 'weui_icon_success weui-icon-success' : item.selected , ' weui_icon_circle weui-icon-circle' : !item.selected}" style="" ></i>
                        </div>
                        <div class="flex flex-1 flex-align-items">
                            <div class="left flex flex-align-items">
                                <img src="~selector/assets/img/headmr.png" class="icon" style="width:100%;height:100%;" v-if="item.headImgUrl == null || item.headImgUrl == ''">
                                <img :src="HostSource + item.headImgUrl" class="icon headImg" style="width:100%;height:100%;" v-if="!(item.headImgUrl == null || item.headImgUrl == '')">
                            </div> 
                            <div class="name flex-1 textLineClamb1">{{item.name}}</div>
                        </div>
                    </div>
                </div>
                <no-data-tip 
                    :msg="msg" 
                    :showFlag="noDataFlag" 
                    top="80"></no-data-tip>
            </div>
        </div>
        <div class="editGroup" 
            @click="checkGroupList()">
            <i class="fa fa-edit"></i>
        </div>
    </div> 
</template>

<script>
import bus from 'selector/assets/js/bus.js'
import { XHeader , Group , Confirm , Cell ,InlineLoading} from 'vux'
import noDataTip from 'selector/components/NoDataTip/NoDataTip.vue'
export default {
    name: 'app',
     data(){
        return {
            deleteModel : false,
            groupList : [],
            memberList : [],
            title : '',
            type : '',
            withUser : '',
            muliteChoice : '',
            editStatus : true,
            groupId : '',
            loading : true,
            msg : '',
            noDataFlag : false,
            HostSource : constGlobal.HostSource,
            deptIdList : []
        }
    },
    components: {
        Cell,
        Group,
        Confirm,
        XHeader,
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
            this.deptIdList = param.deptIdList;
            this.deptId = param.deptId;
            this.withUser = param.withUser;
            this.muliteChoice = param.muliteChoice;

            this.$nextTick(function() {
                bus.$emit("changeTitle", param.title);
            })

            //初始化数据
            this.groupList = [];
            this.memberList = [];
            this.loading = true;
            this.noDataFlag = false;

            if(!param.selectMem){
                this.queryAllGroupList();
            }else{
                this.groupId = param.groupId
                this.queryGroupInfo();
            }
        },
        /**
         * 获取群组人员信息
        */
        queryGroupInfo(){
            this.msg = "未查询相关人员信息";
            var url = constGlobal.HostStaffOrg + 'groupInfoAndUserList/search?groupId=' + this.groupId;
            http.apiGet(url).then(res => {
                if (res.status == 0) {
                    this.loading = false;
                    if(res.data.memberList.length > 0){
                        this.memberList = res.data.memberList;
                        for(var i = 0 ; i < this.memberList.length ; i++){
                            this.memberList[i].selected = false;
                        }
                        this.judgeSelect();
                    }else{
                        this.noDataFlag = true;
                    }
                } else {
                    common.toastMsg(res.message)
                }
            });
        },
        /**
         * 判断人员是否被选择
        */
        judgeSelect(){
            var list = common.sessionGet("selectionStaffUserListEdit");
            if(!list){
                list = this.$parent.$refs.resultRef.userList;
            }
            for(var i = 0 ; i < this.memberList.length ; i++){
                var flag = false;
                for(var j = 0 ; j < list.length ; j++){
                    if(this.memberList[i].id == list[j].id){
                        flag = true;
                        break;
                    }
                }
                if(j < list.length && flag){
                    this.memberList[i].selected = true;
                }
            }
        },
        /** 
         * 获取所有群组信息
        */
        queryAllGroupList(){
            this.msg = "未查询群组信息"
            var url = constGlobal.HostStaffOrg + 'allGroupInfoList/search';
            http.apiGet(url).then(res => {
                if (res.status == 0) {
                    this.loading = false;
                    if(res.data.length > 0){
                        this.groupList = res.data;
                        for(var i = 0 ; i < this.groupList.length ; i++){
                            this.groupList[i].selected = false;
                        }
                        this.judgeGroupSelect();
                    }else{
                        this.noDataFlag = true;
                    }
                } else {
                    common.toastMsg(res.message)
                }
            });
        },
        /**
         * 判断群组是否被选中
        */
        judgeGroupSelect(list){
            var list = common.sessionGet("selectionStaffUserListEdit");
            if(!list){
                list = this.$parent.$refs.resultRef.userList;
            }
            for(var i = 0 ; i < this.groupList.length ; i++){
                for(var j = 0 ; j < this.groupList[i].memberList.length ; j++){
                    for(var k = 0 ; k < list.length ; k++){
                        if(this.groupList[i].memberList[j].id == list[k].id){
                            break;
                        }
                    }
                    if(k == list.length){
                        this.groupList[i].selected = false;
                        break;
                    }
                }
                if(j == this.groupList[i].memberList.length && this.groupList[i].memberList.length > 0){
                    this.groupList[i].selected = true;
                }
            }
        },
        /**
         * 跳转到详情页面
        */
        toModule(item){
            var param = {
                title : item.name,
                type : 'group',
                groupId : item.groupId,
                selectMem : true
            }
            this.$parent.changeLevel('add' , param);
        },
        /**
         * 选择群组中的人
        */
        selectGroup(index){
            this.groupList[index].selected = !this.groupList[index].selected;
            this.groupList.push();
            var memberList = []
            for(var i = 0 ; i < this.groupList[index].memberList.length ; i++){
                var param = {
                    name : this.groupList[index].memberList[i].name,
                    id : this.groupList[index].memberList[i].id
                }
                memberList.push(param);
            }
            var param = {
                userList : memberList,
                type : this.groupList[index].selected
            }
            bus.$emit('operaStaff' , param) 
        },
        /**
         * 选择或取消选择人员
        */
        selectStaffFromUser(info , index){
            if(this.muliteChoice == 2){
                this.clearSelectStaffSelect(info);
            }
            this.memberList[index].selected = !this.memberList[index].selected;
            this.memberList.push();
            var param = {
                userList : [{
                    name : info.name,
                    id : info.id
                }],
                type : this.memberList[index].selected
            }
            bus.$emit('operaStaff' , param) 
        },
        /**
         * 清队已选择人中
        */
        clearSelectStaffSelect(info){
            this.memberList.forEach(item => {
                if(item.selected && item.id != info.id){
                    item.selected = false;
                }
            })
        },
        /**
         * 删除用户并修改相关状态
        */
        updatSelectStatus(param){
            if(this.groupList.length > 0){
                for(var i = 0 ; i < this.groupList.length ; i++){
                    for(var j = 0 ; j < this.groupList[i].memberList.length ; j++){
                        if(param.id == this.groupList[i].memberList[j].id){
                            this.groupList[i].selected = false;
                            this.groupList.push();
                        }
                    }
                }
            }else if(this.memberList.length > 0){
                for(var i = 0 ; i < this.memberList.length ; i++){
                    if(param.id == this.memberList[i].id){
                        this.memberList[i].selected = false;
                        break;
                    }
                }
                this.memberList.push();
            }
            
        },
        checkGroupList(){
            this.$router.push({
                path : '/editGroupList',
                query:{
                    deptId : this.deptId,
                    condition : this.$route.query.condition,
                    deptIdList : common.sessionGet("selectionStaffDeptIdList")
                }
            })
        }
    },
}
</script>
<style lang="scss">
    @import "~selector/assets/css/selection.scss";
    .selectionStaffList{
        .addIcon {
            font-size: 20px;
            color: #ed3269;
        }
        .list{
            border-bottom:1px solid #e6e6e6;
        }
        .editGroup{
            position: absolute;
            bottom: 150px;
            right: 20px;
            background: white;
            width: 60px;
            height: 60px;
            text-align: center;
            line-height: 60px;
            border-radius: 50%;
            font-size: 26px;
            box-shadow: 1px 2px 10px #dedcdc;
            color : $theme;
        }
    }
    
</style>


