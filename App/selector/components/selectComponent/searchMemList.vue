<template>
    <div class="selectionStaffList flex flex-direction-column">  
        <div class="searchWrap">
            <search
                v-model="searchStaffName"
                placeholder="搜索"
                cancelText = "取消"
                position="absolute"
                @on-cancel="searchStaffNameCancel"
                @on-submit="searchStaffNameSubmit"
                ref="search"></search>
        </div>
        <div class="flex-1 overflowYScroll selectionStaffContainer">
             <div 
                style="text-align:center;margin:10px 0px 15px 0px;"
                v-if="!searchLoading && type == 1">
                <inline-loading ></inline-loading>&nbsp;加载中
            </div>
            <div class="list-wrap ">
                <div class="vux-1px-t" v-show="searchLoading && userList.length > 0"></div>
                <!-- 人员列表 -->
                <div class="list flex flex-align-items"
                    style="border-bottom:1px solid #e6e6e6;" 
                    v-for="(item , index) in userList" 
                    :key="item.id" 
                    @click="selectStaff(item , index , 'user')"
                    v-if="userList.length > 0"
                    >
                    <div class="select-left">
                        <i class="weui-icon weui_icon_circle weui-icon-circle" 
                            :class="{ 'weui_icon_success weui-icon-success' : item.selected , ' weui_icon_circle weui-icon-circle' : !item.selected}" style="" ></i>
                    </div>
                    <div class="flex flex-1 flex-align-items">
                        <div class="left">
                            <img src="~selector/assets/img/headmr.png" class="icon" style="width:100%;height:100%;" v-if="item.headImgUrl == null || item.headImgUrl == ''">
                            <img :src="HostSource + item.headImgUrl" class="icon headImg" style="width:100%;height:100%;" v-if="!(item.headImgUrl == null || item.headImgUrl == '')">
                        </div> 
                        <div class="name flex-1 ">{{item.name}}</div>
                    </div>
                </div>
                 <no-data-tip 
                    msg="未查询到人员信息" 
                    :showFlag="searchLoading && userList.length == 0" 
                    top="80"></no-data-tip>
            </div> 
        </div>
    </div>
</template>

<script>
import bus from 'selector/assets/js/bus.js'
import { XHeader , Group , Cell , Search , InlineLoading} from 'vux'
import noDataTip from 'selector/components/NoDataTip/NoDataTip.vue'
export default {
    name: 'app',
     data(){
        return {
            searchStaffName : '',
            title : "搜索",
            deptId : '',
            userIds : [],
            selectUserIds : [], //选择或取消选择人员列表
            userList : [] , //人员列表
            userTypeIdList : [],
            searchLoading : false,
            HostSource : constGlobal.HostSource,
            type : 0,
            deptIdList : []
        }
    },
    components: {
        XHeader,
        Group,
        Search,
        Cell,
        noDataTip,
        InlineLoading
    },
    mounted:function () {

        this.$refs.search.setFocus();

        bus.$on('changeSelectInfo', function(param) {
            this.updatSelectStatus(param)
        }.bind(this)) 
    },
    methods:{
        /*
        * 初始化搜索参数
        */
        init(param){
            var _this = this;
            this.deptId = param.deptId;
            this.deptIdList = param.deptIdList ? param.deptIdList : [];
            this.withUser = param.withUser;
            this.muliteChoice = param.muliteChoice;
            this.userTypeIdList = param.userTypeIdList;

            this.$nextTick(function() {
                bus.$emit("changeTitle", param.title);
            })
        },
        /*
        * 搜索取消
        */
        searchStaffNameCancel(){
            this.$parent.changeLevel('delete');
        },
        /*
        * 搜索
        */
        searchStaffNameSubmit(){
            this.userList = [];
            this.type = 1;
            this.searchLoading = false;
            var url = constGlobal.HostStaffOrg + 'userBaseInfoForPlugIn/searchByManyRoot';
            var ids = [];
            for(var i = 0 ; i < this.deptIdList.length ; i++){
                ids.push(this.deptIdList[i].id);
            }
            var param = {
                deptId : this.deptId,
                fuzzy : this.searchStaffName,
                userTypeIdList : this.userTypeIdList,
                withUser : this.withUser,
                isDirectly : this.isDirectly ,
                deptIdList : ids
            }
            http.apiPost( url , param ).then(res => {
                if (res.status == 0) {
                    if(res.data){
                        this.userList = res.data;
                        this.searchLoading = true;
                        this.judgeUserSelect()
                    }
                } else {
                    common.toastMsg(res.message)
                }
            });
        },
        /**
         * 根据ids获取用户详情
        */
        queryUserAccordionIds(){
            var url = constGlobal.HostStaffOrg + 'userBaseInfo/search';
            var param = {
                ids : this.userIds,
            }
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                    this.deptLoading = true;
                    this.userList = res.data;
                    this.userList.forEach(item => {
                        item.selected = false;
                    })
                    this.judgeUserSelect();
                } else {
                    common.toastMsg(res.message)
                }
            });
        },
        /**
         * 选择或取消选择人员
        */
        selectStaff(item , index ){
            this.selectStaffFromUser(item , index);
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
         * 清队已选择人中
        */
        clearSelectStaffSelect(info){
            this.userList.forEach(item => {
                if(item.selected && item.id != info.id){
                    item.selected = false;
                }
            })
        },
        /**
         * 判断人员是否被选中
        */
        judgeUserSelect(){
            var list = common.sessionGet("selectionStaffUserList");
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
         * 全选
        */
        selectListAll(){
            this.userList.forEach( item => {
                item.selected = true;
            })
            this.userList.push()
            var param = {
                userList : this.userList,
                type : true
            }
            bus.$emit('operaStaff' , param) 
        },
        /**
         * 修改用户状态
        */
        changeUserListSelect(param){
            if(this.userList.length == 0){
                return;
            }
            for(var i = 0 ; i < this.userList.length ; i++){
                if(param.id == this.userList[i].id){
                    this.userList[i].selected = false;
                    this.userList.push();
                    break;
                }
            }
        },
    },
}
</script>
<style lang="scss">
    @import "~selector/assets/css/selection.scss";
</style>


