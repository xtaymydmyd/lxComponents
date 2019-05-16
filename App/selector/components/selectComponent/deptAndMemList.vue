<template>
    <div class="selectionStaffList flex flex-direction-column">  
        <div class="flex-1 overflowYScroll selectionStaffContainer">
            <div 
                style="text-align:center;margin:10px 0px 15px 0px;"
                v-if="(type == 'depart' && !deptLoading) || (type == 'post' && !postLoading)">
                <inline-loading ></inline-loading>&nbsp;加载中
            </div>
            <div class="list-wrap ">
                <div class="vux-1px-t" v-show="(type == 'depart' && withUser == 1 && deptLoading && deptInfoList.length > 0 && userList.length > 0 )||(type == 'depart' && withUser == 2 && deptLoading && deptInfoList.length > 0 )"></div>
                <!-- 部门列表 -->
                <div class="list flex flex-align-items vux-1px-b"
                    v-for="(item , index) in deptInfoList" 
                    :key="item.id" 
                    v-show="type == 'depart' && deptLoading && deptInfoList.length > 0"
                    >
                    <div class="select-left" 
                        @click="selectStaff(item , index , 'depart')" 
                        v-if="muliteChoice != 2 " >
                        <i class="weui-icon weui_icon_circle weui-icon-circle" v-if=" item.nodeType != '0'" :class="{ 'weui_icon_success weui-icon-success' : item.selected , ' weui_icon_circle weui-icon-circle' : !item.selected }" style="" ></i>
                    </div>
                    <div class="flex flex-1 flex-align-items" >
                        <div class="left">
                            <i class="fa fa-folder-open"></i>
                        </div>
                        <div class="name flex-1 textLineClamb1">{{item.name}} <span v-if="item.userIds">({{item.userIds.length}})</span></div>
                        <div class="disableArrow flex flex-align-items" v-show="item.selected">
                            <img class="disableArrow_img" src="data:image/jpeg;base64,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QFkAAAAAAAAAAAAQY3JvcFdoZW5QcmludGluZ2Jvb2wAAAAADmNyb3BSZWN0Qm90dG9tbG9uZwAAAAAAAAAMY3JvcFJlY3RMZWZ0bG9uZwAAAAAAAAANY3JvcFJlY3RSaWdodGxvbmcAAAAAAAAAC2Nyb3BSZWN0VG9wbG9uZwAAAAAAOEJJTQPtAAAAAAAQAEgAAAABAAIASAAAAAEAAjhCSU0EJgAAAAAADgAAAAAAAAAAAAA/gAAAOEJJTQQNAAAAAAAEAAAAHjhCSU0EGQAAAAAABAAAAB44QklNA/MAAAAAAAkAAAAAAAAAAAEAOEJJTScQAAAAAAAKAAEAAAAAAAAAAjhCSU0D9QAAAAAASAAvZmYAAQBsZmYABgAAAAAAAQAvZmYAAQChmZoABgAAAAAAAQAyAAAAAQBaAAAABgAAAAAAAQA1AAAAAQAtAAAABgAAAAAAAThCSU0D+AAAAAAAcAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAA4QklNBAAAAAAAAAIAADhCSU0EAgAAAAAAAgAAOEJJTQQwAAAAAAABAQA4QklNBC0AAAAAAAYAAQAAAAM4QklNBAgAAAAAABAAAAABAAACQAAAAkAAAAAAOEJJTQQeAAAAAAAEAAAAADhCSU0EGgAAAAADOQAAAAYAAAAAAAAAAAAAACAAAAAgAAAAAk4Lj30AAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAACAAAAAgAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAEAAAAAAABudWxsAAAAAgAAAAZib3VuZHNPYmpjAAAAAQAAAAAAAFJjdDEAAAAEAAAAAFRvcCBsb25nAAAAAAAAAABMZWZ0bG9uZwAAAAAAAAAAQnRvbWxvbmcAAAAgAAAAAFJnaHRsb25nAAAAIAAAAAZzbGljZXNWbExzAAAAAU9iamMAAAABAAAAAAAFc2xpY2UAAAASAAAAB3NsaWNlSURsb25nAAAAAAAAAAdncm91cElEbG9uZwAAAAAAAAAGb3JpZ2luZW51bQAA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PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChNYWNpbnRvc2gpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOS0wNS0xNlQxNDo1NzozNCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTktMDUtMTZUMTQ6NTk6NTQrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTktMDUtMTZUMTQ6NTk6NTQrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvanBlZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1NmFiM2RiMi04YWQ4LTQ5MmYtYmRhNS0yNWY1NzcyMmI4OTYiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDphMjJkYmYwNC1iODM2LTExN2MtYTljMC04YjMzNjQ4NjFhZGQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmZWUxN2Q2ZS01OGZhLTRkOTgtYWIwOS0zMzc0ZjBlN2NkMDciPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmZlZTE3ZDZlLTU4ZmEtNGQ5OC1hYjA5LTMzNzRmMGU3Y2QwNyIgc3RFdnQ6d2hlbj0iMjAxOS0wNS0xNlQxNDo1NzozNCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmIzMjgwN2VlLTc3ZGYtNDMyMS04MzdiLWYwNTViOWIzZDAzMyIgc3RFdnQ6d2hlbj0iMjAxOS0wNS0xNlQxNDo1OTowNyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmExZjE4ZjE5LTFjMjUtNGZmYy1hMTJlLTAxNDg5YTY0Zjk4ZSIgc3RFdnQ6d2hlbj0iMjAxOS0wNS0xNlQxNDo1OTo1NCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL2pwZWciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvanBlZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NTZhYjNkYjItOGFkOC00OTJmLWJkYTUtMjVmNTc3MjJiODk2IiBzdEV2dDp3aGVuPSIyMDE5LTA1LTE2VDE0OjU5OjU0KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YTFmMThmMTktMWMyNS00ZmZjLWExMmUtMDE0ODlhNjRmOThlIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmZlZTE3ZDZlLTU4ZmEtNGQ5OC1hYjA5LTMzNzRmMGU3Y2QwNyIgc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmZlZTE3ZDZlLTU4ZmEtNGQ5OC1hYjA5LTMzNzRmMGU3Y2QwNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+/+4ADkFkb2JlAGSAAAAAAf/bAIQADAgICAkIDAkJDBELCgsRFQ8MDA8VGBMTFRMTGBEMDAwMDAwRDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAENCwsNDg0QDg4QFA4ODhQUDg4ODhQRDAwMDAwREQwMDAwMDBEMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAIAAgAwEiAAIRAQMRAf/dAAQAAv/EAT8AAAEFAQEBAQEBAAAAAAAAAAMAAQIEBQYHCAkKCwEAAQUBAQEBAQEAAAAAAAAAAQACAwQFBgcICQoLEAABBAEDAgQCBQcGCAUDDDMBAAIRAwQhEjEFQVFhEyJxgTIGFJGhsUIjJBVSwWIzNHKC0UMHJZJT8OHxY3M1FqKygyZEk1RkRcKjdDYX0lXiZfKzhMPTdePzRieUpIW0lcTU5PSltcXV5fVWZnaGlqa2xtbm9jdHV2d3h5ent8fX5/cRAAICAQIEBAMEBQYHBwYFNQEAAhEDITESBEFRYXEiEwUygZEUobFCI8FS0fAzJGLhcoKSQ1MVY3M08SUGFqKygwcmNcLSRJNUoxdkRVU2dGXi8rOEw9N14/NGlKSFtJXE1OT0pbXF1eX1VmZ2hpamtsbW5vYnN0dXZ3eHl6e3x//aAAwDAQACEQMRAD8A9JssvdkPrZY2trAOQNZHmp4ltrn2MscH7CIcPNLLrx2tN1le9wgckeSJTXRU39GA3dqdVITHg28NhuN9WMCXHv47nY/L6UqSDfkelsDW73PmAD4KFeU91rarKjWXTBmeE3glVruON0//0PTOof0V3xH5UwwMYgHafvKNkU+tUa52zGvPCD9myP8AuQfu/wBqkjL00JcOp7sco+qzHi0HZbJqprZWPU9HYTsPPPKjj+m+9rjebXtB2ggj8qlfRf8AoXNi51ZO7dAmU1dd7shlj621tYDwRrI8k4EcPzdJfu/+j+paQeL5esf3v/RPS//Z" alt="">
                            <span class="disableArrow_text">下级</span>
                        </div>
                        <div class="arrow flex flex-align-items" v-show="!item.selected" @click="toModule(item , index)">
                            <img class="arrow_img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADEElEQVR4Xu2av4sTQRTHvy+KBwGt7Cz8gSCIFv5iF+wFAwq6i/+AIgh2lipeRC0tRVD/Ackih3CHYKGexWwkKAqHhVfYa6Uod9F9st1lNyEz2Xm3EzMpk3nffe+TN5O33yxhxl804/XDA/AdMITAsefc3LqO+2CcArCbCA0dUMzIAHwl4EV/Dtd6Z+iXTlyda0pb4OBT3rZjC3oADlVKjPHpWxMnvrRorZKOcHAJQJDwbQJuWrruvIqobUlLRKYEIOzwRxAO27gaMz6kMR2xoSWlUe6ADv/V3fPjkmLGehrT3Lh1dX5e7oCEuZiQikjr5zKsEFsXBA+gSL7Kt1gl1ndATQT8FvBboEAgSDgj2LlJYoDTiLTG6Jp2QLnQIOFVAvZZSmhVRbTfkpaIzLAz4DGAizauxoxHaUyXbWhJaZQAnFzg7X/6eEeEA1UuyoyVHxmClQv0s4qOdOzQCW/gdpiwR/dM+C9uh6WJu6avNeO7lrTNfDwAmzSnUcu4A8IOXwdwJS82IzzoRnRPunBJj9IIQPiMTyPD4kDBDbTUOVqSgiDtUZoByL99wp2BYhk3VEx3pQBIe5RmABKeB3CrUGxbRZS/L/KS9iidBxAIe5TOA6jiMunEegAmGzccfga8BvDKRKe4loE1EJbT8/R2sw0aGx1QpfZibOlA1WnjUQnoxDoFgIHvaUQ7NxakU4QHMIKADjynOgDAExXRpY31SHuUNgBYOQSzDN1sL970jlO/AEDUo7QBQHYSTFjUo3QegLRH6TyAfDtIepRTAcDmoFHU8gBM6I4YhUUPQZP8JlnrO8CEWl0d4I4nWIMj5JYnWAMA7wkKP7fo/CHoPcEKzx5u1u2w6BygU8TUGyL5I7UELPeBq72YPs+sIwSgqyIK3AUw7K8xk0lq3FrGbxVT010ACZ8FsDCujok/Z7xXMR11FgCYG0GChwS0QNg1caGFwPwMAKFLjLaK6aWznqCtgk10pJ9bNBqETBK3tTZ0yRO0VZSJjlOeoEniNtc64wnaLMoVLefPAGlQHoA0Ydf1/wG+t0dfqRrD5AAAAABJRU5ErkJggg==" alt="">
                            <span class="arrow_text">下级</span>
                        </div>
                    </div>
                </div>
                <!-- 人员列表 -->
                <div class="list flex flex-align-items vux-1px-b"
                    v-for="(item , index) in userList" 
                    :key="item.id" 
                    @click="selectStaff(item , index , 'user')"
                    v-show="userList.length > 0 && withUser == 1">
                    <div class="select-left">
                        <i class="weui-icon weui_icon_circle weui-icon-circle" 
                            :class="{ 'weui_icon_success weui-icon-success' : item.selected , ' weui_icon_circle weui-icon-circle' : !item.selected}" style="" ></i>
                    </div>
                    <div class="flex flex-1 flex-align-items">
                        <div class="left memberLeft flex flex-align-items flex-justify-content">
                            <!-- <img src="~selector/assets/img/headmr.png" class="icon" style="width:100%;height:100%;" v-if="item.headImgUrl == null || item.headImgUrl == ''">
                            <img :src="HostSource + item.headImgUrl " class="icon headImg" style="width:100%;height:100%;" v-if="!(item.headImgUrl == null || item.headImgUrl == '')"> -->
                            {{getShortName(item.name)}}
                        </div> 
                        <div class="name flex-1 ">{{item.name}}</div>
                    </div>
                </div>
                 <no-data-tip 
                    :msg="msg" 
                    :showFlag="(type == 'depart' && withUser == 1 && deptLoading && deptInfoList.length == 0 && userList.length == 0)|| (type == 'depart' && withUser == 2 && deptLoading && deptInfoList.length == 0 )" 
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
            selectionStaffCondition : common.sessionGet("selectionStaff"),
            title : "选择",
            deptId : '',
            deptInfoList : [], //部门列表
            deptAndUserIdsList : [],
            deptLoading : false,
            type : '',
            
            userIds : [],
            selectUserIds : [], //选择或取消选择人员列表
            userList : [] , //人员列表

            postLoading : false,
            sourceUrl : constGlobal.HostSource,
            msg : '',
            withUser : 1, //是否查询用户  1：查询用户，2:不查询用户
            muliteChoice : 1,
            ignoreUserIdList : [],
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
            this.deptIdList = param.deptIdList ? param.deptIdList : [];
            this.withUser = param.withUser;
            this.muliteChoice = param.muliteChoice;
            this.userTypeIdList = param.userTypeIdList;
            this.ignoreOneself = param.ignoreOneself;
            this.ignoreUserIdList = param.ignoreUserIdList && param.ignoreUserIdList.length > 0 ? param.ignoreUserIdList : [];

            this.$nextTick(function() {
                bus.$emit("changeTitle", param.title);
            })
            this.initInfo();
        },
        /**
         * 初始化页面数据
        */
        initInfo(){
            this.msg = this.withUser == 1 ? '未查询相关部门或人员信息' : '未查询相关部门';
            this.deptLoading = false;
            this.deptInfoList = [];
            this.userIds = [];
            this.userList = [];

            // var flag = false;
            // var paramIdList = common.sessionGet("selectionStaffDeptIdList");
            // for(var i = 0 ; i < paramIdList && paramIdList.length ; i++){
            //     for(var j = 0 ; j < this.deptIdList.length ; j++){
            //         if(paramIdList[i].id == this.deptIdList[j].id){
            //             flag = true;
            //             break;
            //         }
            //     }
            // }
            if(this.deptIdList.length > 0){ //查询传入的部门id的信息
                this.queryDepaIdListInfo()
            }else{//查询传入的子部门的信息
                this.queryChildDeptAndSelfMember();
            }
        },
        /**
         * 查询部门信息
        */
        queryDepaIdListInfo(){
             var url = constGlobal.HostStaffOrg + 'corpOrDept/search';

            if( !this.deptId && !this.deptIdList){
                this.postLoading = true;
                this.msg = '出错啦';
                return 
            }
            var param = this.deptIdList
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                    if(res.data){
                        this.deptInfoList = res.data;
                        
                        this.deptInfoList.forEach(item => {
                            item.selected = false;
                        })
                        if(this.withUser == 1){ //选择人员
                        }else{
                            this.determineDeptSelectStatus();
                        }
                        this.deptLoading = true;
                    }
                } else {
                    common.toastMsg(res.message)
                }
            });
        },
        /**
         *  查询子级部门(不包含孙级)和成员(该部门)
        */
        queryChildDeptAndSelfMember(){
            var url = constGlobal.HostStaffOrg + 'childDeptAndSelfMember/search';

            if( !this.deptId && !this.deptIdList){
                this.postLoading = true;
                this.msg = '出错啦';
                return 
            }
            var param = {
                deptId : this.deptId,
                deptIdList : this.deptIdList,
                withUser : this.withUser, //0不查询用户
  	            userTypeIdList : this.userTypeIdList,
            }
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                    if(res.data){
                        this.deptInfoList = res.data.deptInfoVoList;
                        console.log(this.deptInfoList);
                        this.userList = res.data.userInfoList;
                        this.deptInfoList.forEach(item => {
                            item.selected = false;
                        })
                        if(this.withUser == 1){ //选择人员
                            this.userList.forEach(item => {
                                item.selected = false;
                            })
                            this.determineUserSelectStatus();
                            this.querymemberFillUpDept();
                        }else{
                            this.determineDeptSelectStatus();
                        }
                        this.deptLoading = true;
                        // if(this.deptInfoList.length == 0 && this.userList.length == 0){
                        //     this.deptLoading = false;
                        // }
                    }
                } else {
                    common.toastMsg(res.message)
                }
            });
        },
        /**
         * 判断部门是否被选中
        */
        determineDeptSelectStatus(){
            var deptList = this.$parent.$refs.resultRef.deptList;
            for(var i = 0 ; i < this.deptInfoList.length ; i++){
                for(var j = 0 ; j < deptList.length ; j++){
                    if(this.deptInfoList[i].id == deptList[j].id){
                        this.deptInfoList[i].selected = true;
                    }
                }
            }
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
         * 根据人判断哪些部门是否选中
        */
        querymemberFillUpDept(){
        
            var _this = this;
            var url = constGlobal.HostStaffOrg + 'memberFillUpDept/search';
            var userList = this.$parent.$refs.resultRef.userList;
            this.selectDepartList = [];
            if(userList.length == 0){
                return;
            }
            var ids = [];
            userList.forEach( item => {
                ids.push(item.id);
            })
            var param = {
                userIdList : ids,   //必传
  	            userTypeIdList : [] //可为空
            }
            if(this.ignoreOneself == 1){
                param.ignoreUserIdList = this.ignoreUserIdList
            }
            
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                    if(res.data){
                        this.selectDepartList = res.data;
                        this.determineDepartSelectStatus();
                    }
                } else {
                    common.toastMsg(res.message)
                }
            });
        },
        /**
         * 判断部门是否被选中
        */
        determineDepartSelectStatus(){
            var _this = this;
            var flag = false;
            this.deptInfoList.forEach(item =>{
                item.selected = false;
            })
            if(this.selectDepartList.length > 0){
                for(var i = 0 ; i < this.selectDepartList.length ; i++){
                    for(var j = 0 ; j < this.deptInfoList.length ; j++){
                        if(this.selectDepartList[i] == this.deptInfoList[j].id){
                            this.deptInfoList[j].selected = true;
                            flag = true;
                        }
                    }
                }
            }else{
                flag = true;
            }
            if(!flag) return;
            this.deptInfoList.push();
        },
        /**
         * 删除用户并修改相关状态
        */
        updatSelectStatus(param){
            this.changeUserListSelect(param);
            this.querymemberFillUpDept();
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
                    break;
                }
            }
            this.userList.push();
        },
        /**
         * 如果是部门
        */
        toModule(item , index){
            var param = {
                title : item.name,
                type : 'depart',
                deptId : item.id
            }
            this.$parent.changeLevel('add' , param);
        },
        /**
         * 选择或取消选择人员
        */
        selectStaff(item , index , type){
            switch (type) {
                case 'depart':
                    if(item.nodeType == '0'){
                        return;
                    }
                    if(this.withUser == 1){
                        this.selectStaffFromDepart(item , index);
                    }else{
                        this.selectStaffDepart(item , index);
                    }
                    break;
                case 'user':
                    this.selectStaffFromUser(item , index);
                    break;
                default:
                    console.log("default")
            }
        },
        /**
         * 选择或取消选择部门 - withUser = 2 不选人
        */
        selectStaffDepart(item , index){
            this.deptInfoList[index].selected = !this.deptInfoList[index].selected;
            this.deptInfoList.push();
            var param = {
                deptList : [item],
                type : this.deptInfoList[index].selected 
            }
            bus.$emit('operaStaffDepart' , param) 
        },
        /**
         * 选择或取消选择部门
        */
        selectStaffFromDepart(info , index){
            var _this = this;
            this.selectUserIds = [];
            this.queryChildrenDeptAndMember(index , info.id)
        },
        queryChildrenDeptAndMember(index , id ){
            var url = constGlobal.HostStaffOrg + 'childrenDeptAndMember/search';
            var param = {
                deptId : id,
                withUser : this.withUser, //0不查询用户
                deptMaximum : 1000, // 设置部门返回值数量限制
  	            userMaximum : 1000 //设置部门返回值数量限制
            }
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                    this.deptInfoList[index].selected = !this.deptInfoList[index].selected;
                    this.deptInfoList.push();
                    var param = {
                        userList : res.data.userInfoList,
                        type : this.deptInfoList[index].selected
                    }
                    bus.$emit('operaStaff' , param) 
                } else {
                    common.toastMsg(res.message)
                }
            });
        },
        getShortName(name){
            return name.slice(name.length - 2 , name.length)
        },
        /**
         * 根据选择部门下ids获取用户详情
        */
        queryUserAccordionDptIds(status , ids){
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
        }
    },
}
</script>
<style lang="scss">
    @import "~selector/assets/css/selection.scss";
</style>


  