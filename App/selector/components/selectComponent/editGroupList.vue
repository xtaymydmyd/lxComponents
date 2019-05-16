<template>
    <div class="editGroupList flex flex-direction-column">  
        <div class="head_bg nav-header  vux-1px-b" >
            <x-header :left-options="{backText: ''}" title="群组"></x-header>
        </div>
        <div class="flex-1 overflowYScroll selectionStaffContainer">
            <div class="list-wrap">
                <div class="vux-1px-t" v-show="groupList.length > 0"></div>
                <div 
                    style="text-align:center;margin:10px 0px 15px 0px;"
                    v-if="groupList.length == 0">
                    <inline-loading ></inline-loading>&nbsp;加载中
                </div>
                <swipeout>
                    <swipeout-item transition-mode="follow" 
                        v-for="(item , index) in groupList" 
                        :key="item.id" 
                        >
                        <div slot="content" class="list flex flex-align-items" style="border-bottom:1px solid #e6e6e6;" >
                            <div class="flex flex-1 flex-align-items" @click="toModule(item , index)">
                                <div class="left">
                                    <i class="fa fa-folder-open"></i>
                                </div>
                                <div class="name flex-1 textLineClamb1">{{item.name}}</div>
                                <div class="arrow">
                                    <x-icon type="ios-arrow-right" size="15"></x-icon>
                                </div>
                            </div>
                        </div>
                        <div slot="right-menu" >
                            <swipeout-button type="warn" @click.native="deleteData(item , index)">删除</swipeout-button>
                        </div>
                    </swipeout-item>
                </swipeout>
            </div>
        </div>
        <div class="add-group flex flex flex-align-items flex-justify-content" @click="addGroup('/groupInfo' , 'add')">
            <x-icon type="ios-plus-empty" size="30"></x-icon>
            <div>新增群组</div>
        </div>
    </div> 
</template>

<script>
import bus from 'selector/assets/js/bus.js'
import { XHeader , Group , Confirm , Cell ,InlineLoading , Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
import noDataTip from 'selector/components/NoDataTip/NoDataTip.vue'
export default {
    name: 'app',
     data(){
        return {
            groupList : [],
            title : '',
            type : '',
            withUser : '',
            muliteChoice : '',
            editStatus : true,
            query : {}
        }
    },
    components: {
        Cell,
        Group,
        Confirm,
        XHeader,
        noDataTip,
        InlineLoading,
        Swipeout,
        SwipeoutItem,
        SwipeoutButton
    },
    mounted:function () {
        this.query = this.$route.query;
        this.queryAllGroupList();
    },
    methods:{
        /**
         * 获取所有群组信息
        */
        queryAllGroupList(){
            var url = constGlobal.HostStaffOrg + 'allGroupInfoList/search';
            http.apiGet(url).then(res => {
                if (res.status == 0) {
                    this.groupList = res.data;
                } else {
                    common.toastMsg(res.message)
                }
            });
        },
        /**
         * 打开删除群组对话框
        */
        deleteData(item){
            var url = constGlobal.HostStaffOrg + 'group/delete';
            var ids = [item.groupId];
            var _this = this;
            this.$vux.confirm.show({
                title: '删除提示',
                content: '是否删除群组？',
                confirmText : '确认',
                cancelText : '取消',
                onCancel () {
                },
                onConfirm () {
                    var param = {
                        ids : ids
                    }
                    http.apiPost(url , param).then(res => {
                        if (res.status == 0) {
                            if(res.data){
                                _this.queryAllGroupList();
                            }
                        } else {
                            common.toastMsg(res.message)
                        }
                    });
                }
            })
        },
        changeEditStatus(){
            this.editStatus = !this.editStatus;
        },
        /**
         * 跳转到添加群组对话框
        */
        addGroup(path){
            this.$router.replace({
                path : path , 
                query : {
                    type : 'add',
                    deptId : this.query.deptId,
                    condition : this.query.condition,
                    deptIdList : common.sessionGet("selectionStaffDeptIdList")
                }
            })
        },
        /**
         * 跳转到编辑群组对话框
        */
        toModule(item ,index){
            this.$router.replace({
                path : '/groupInfo' , 
                query : {
                    type : 'edit' , 
                    groupId : item.groupId,
                    deptId : this.query.deptId,
                    condition : this.query.condition,
                    deptIdList : common.sessionGet("selectionStaffDeptIdList"),
                    readonly : item.publicLevel == 2 ? 0 : 1
                    
                }
            })
        },
    },
}
</script>
<style lang="scss">
    @import "~selector/assets/css/public.scss";
    @import "~selector/assets/css/public.scss";
    @import "~selector/assets/css/selection.scss";
    .editGroupList{
        width:100%;
        height:100%;
        .add-group{
            height: 50px;
            line-height: 50px;
            background: white;
            color: $font_color_blue;
            .vux-x-icon {
                fill: $font_color_blue;
            }
        }
       
        .list-wrap{
            .list{
                border-bottom:1px solid #e6e6e6;
                background:white;
                padding: 10px 15px;
                .left{
                    width: 40px;
                    height: 40px;
                    font-size: 18px;
                    background: #eaeaea;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 40px;
                    margin-right: 10px;
                    color :$theme;
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
    }
    
</style>


