<template>
    <div class="roleContentWrap overflowYAuto" :style="{height : height}">
        <Collapse v-model="collapseVal" accordion>
            <Panel 
                :name="item.value" 
                v-for="(item , index) in completeOrgTree" 
                :key="index">
                {{item.label}}
                <div slot="content">
                    <div  v-for="(list , i ) in item.children" :key="list.id + '' + i" class="flex flex-align-items"  @click="changeCheck(i , item.id)">
                        <label class="checkboxLabel flex flex-align-items ivu-checkbox-wrapper ivu-checkbox-group-item ivu-checkbox-default">
                            <span class="ivu-checkbox" :class="{'ivu-checkbox-checked' : list.check}">
                                <span class="ivu-checkbox-inner"></span> 
                            </span> 
                            <i class="ivu-icon ivu-icon-md-person"></i> 
                            <span>{{list.name}}</span>
                        </label>
                    </div>
                    <div v-show="(item.id == 3 && item.children.length == 0 && !roleLoading) || (item.id == 4 && item.children.length == 0 && !groupLoading) || (item.id == 5 && item.children.length == 0 && !postLoading)" style="text-align: center;color: #999;padding: 10px;">
                        暂无数据
                    </div>
                </div>
            </Panel>
        </Collapse>
    </div>
</template>

<script>
export default {
    name: 'index',
     data(){
        return {
            config : {
                parentDetpIdList : [],
                condition : []
            },
            condition : {
                org : false,
                role : false,
                charge : false
            },
            height:"329px",
            collapseVal : '1',
            completeOrgTree:[{
                label: '角色列表',
                id : 3,
                value : '3',
                children: []
            }, {
                label: '群组列表',
                id : 4,
                value : '4',
                children: []
            }, {
                label: '岗位列表',
                id : 5,
                value : '5',
                children: []
            }],
            roleLoading : true,
            groupLoading : true,
            postLoading : true,
            checkAllGroup : [],
            config : {},
            condition : {},
            result : [],
            fuzzy : ''
        }
    },
    methods : {
        /**
         * 初始化
        */
        init(config , condition , fuzzy , result){
            this.config = config;
            this.condition = condition;
            this.height = ((condition.org && condition.role && !condition.charge) || (condition.org && !condition.role && condition.charge) || (!condition.org && condition.role && condition.charge) || (condition.org && condition.role && condition.charge)) ? "329px" : '370px';
            this.result = result;
            this.fuzzy = fuzzy;

            this.roleLoading = true;
            this.groupLoading = true;
            this.postLoading = true;

            this.getRoleList();
            this.getGroupList();
            this.getPostList();
        },
        /**
         * 获取角色列表
        */
        getRoleList(){
            var url = constGlobal.HostPrivilege + 'roleList/search';
            var param = {
                fuzzy : this.fuzzy
            }
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                    if(res.data){
                        for(var i = 0 ; i < res.data.length ; i++){
                            res.data[i].check = false;
                        }
                        this.completeOrgTree[0].children = res.data;
                        this.initCheck();
                        this.roleLoading = false;
                    }
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
        initCheck(){
            for(var i = 0 ; i < this.result.length ; i++){
                for(var j = 0 ; j < this.completeOrgTree.length ; j++){
                    for(var k = 0 ; k < this.completeOrgTree[j].children.length ; k++){
                        if(this.result[i].id == this.completeOrgTree[j].children[k].id){
                            this.completeOrgTree[j].children[k].check = true;
                        }
                    }
                }
            }
            this.completeOrgTree.push()
        },
        /**
         * 获取群组列表
        */
        getGroupList(){
            var url = constGlobal.HostContact + 'groupList/searchByVisable';
            var param = {
                groupFuzzy : this.fuzzy
            }
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                    if(res.data){
                        for(var i = 0 ; i < res.data.length ; i++){
                            res.data[i].id = res.data[i].groupId;
                            res.data[i].check = false;
                        }
                        this.completeOrgTree[1].children = res.data;
                        this.initCheck();
                        this.groupLoading = false;
                    }
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
        /**
         * 获取群组列表
        */
        getPostList(){
            var url = constGlobal.HostContact + 'postList/search';
            var param = {
                fuzzy : this.fuzzy
            }
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                    if(res.data){
                        for(var i = 0 ; i < res.data.length ; i++){
                            res.data[i].check = false;
                        }
                        this.completeOrgTree[2].children = res.data;
                        this.initCheck();
                        this.postLoading = false
                    }
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
        changeCheck(index , type){ 
            if(type == 3) { // 改变部门状态
                this.$emit("role-check-change", this.completeOrgTree[0].children[index] , this.completeOrgTree[0].children[index].check , type)
            }else if(type == 4) {
                this.$emit("role-check-change", this.completeOrgTree[1].children[index] , this.completeOrgTree[1].children[index].check , type)
            }if(type == 5) {
                this.$emit("role-check-change", this.completeOrgTree[2].children[index] , this.completeOrgTree[2].children[index].check , type)
            }
        },
        /**
         * 设置选中
        */
        setCheckStatus(result , id){
            this.result = result;
            if(this.config.muliteChoice == 1){
                for(var k = 0 ; k < this.completeOrgTree.length ; k++) {
                    if( id == this.completeOrgTree[k].id ){
                        for(var i = 0 ; i < this.completeOrgTree[k].children.length ; i++){
                            this.completeOrgTree[k].children[i].check = false;
                        }
                        for(var i = 0 ; i < this.result.length ; i++){
                            for(var j = 0 ; j < this.completeOrgTree[k].children.length ; j++){
                                if(this.result[i].id == this.completeOrgTree[k].children[j].id){
                                    this.completeOrgTree[k].children[j].check = true;
                                }
                            }
                        }
                        this.completeOrgTree[k].children.push()
                    }
                }
            }else if(this.config.muliteChoice == 2) {
                for(var k = 0 ; k < this.completeOrgTree.length ; k++) {
                    for(var i = 0 ; i < this.completeOrgTree[k].children.length ; i++){
                        this.completeOrgTree[k].children[i].check = false;
                    }
                }
                for(var k = 0 ; k < this.completeOrgTree.length ; k++) {
                    if( id == this.completeOrgTree[k].id ){
                        for(var i = 0 ; i < this.result.length ; i++){
                            for(var j = 0 ; j < this.completeOrgTree[k].children.length ; j++){
                                if(this.result[i].id == this.completeOrgTree[k].children[j].id){
                                    this.completeOrgTree[k].children[j].check = true;
                                }
                            }
                        }
                        this.completeOrgTree[k].children.push()
                    }
                }
            }
            
        },
        getShortName(name){
            return name.slice(name.length - 2 , name.length)
        },
        submit(){

        },
        cancel(){

        }
    }
}
</script>

<style lang="scss">
    @import '~assets/css/public.scss';
    @import '~assets/css/flexComp.scss';
    .selectComponent{
        .ivu-modal-body{
            min-height:450px;
            position:relative;
        }
        .ivu-modal-body:before{
            content: "";
            height: 451px;
            left: 55%;
            position: absolute;
            top: 0px;
            bottom: 0px;
            border-right: 1px solid #eaeaea;
        }
        .selector_right_text{
            font-size:14px;
        }
        .overflowYAuto{
            overflow-y:auto;
        }
        .selector{
            height: 418px;
            .selector_left{
                width: 55%;
                padding-right: 15px;
                .selector_left_content{
                    margin-top:15px;
                }
                .ivu-tabs{
                    height:100%;
                    display: box;
                    display: -webkit-box;
                    display: -moz-box;
                    display: -ms-flexbox;
                    display: -webkit-flex;
                    display: flex;
                    -webkit-box-flex-direction: row;
                    -moz-flex-direction: row;
                    -mx-flex-direction: row;
                    -webkit-flex-direction: row;
                    flex-direction: row;
                    display: box;
                    display: -webkit-box;
                    display: -moz-box;
                    display: -ms-flexbox;
                    display: -webkit-flex;
                    -webkit-box-orient: vertical;
                    -webkit-flex-direction: column;
                    -moz-flex-direction: column;
                    -ms-flex-direction: column;
                    -o-flex-direction: column;
                    flex-direction: column;
                    .ivu-tabs-bar{
                        margin-bottom:10px;
                    }
                    .ivu-tabs-content{
                        -webkit-box-flex: 1;
                        -moz-box-flex: 1;
                        -webkit-flex: 1;
                        -ms-flex: 1;
                        flex: 1;
                        .ivu-tabs-tabpane{
                            height:100%;
                        }
                    }
                }
                
                .roleContentWrap{
                    overflow-y:auto;
                }
                .checkboxAll{
                    border-bottom: 1px solid rgb(233, 233, 233);
                    padding-bottom: 10px;
                    margin-bottom: 6px;
                    padding-left: 8px;
                    .ivu-checkbox{
                        margin-right:8px;
                    }
                }
                .checkboxLabel{
                    width: 100%;
                    display: inline-block;
                    padding: 8px 8px 8px 10px;
                    margin-right:0px;
                   
                    .ivu-icon{
                        font-size: 18px;
                        margin-left: 8px;
                        margin-right: 3px;
                        color: #73c8ea;
                        margin-top:-2px;
                    }
                    
                }
                .ivu-collapse-content{
                    padding:0px;
                    .ivu-collapse-content-box{
                        padding:5px 0px;
                    }
                }
                .contentOrgWrap{
                    .checkboxLabel{
                        width: 100%;
                        display: inline-block;
                        padding: 6px 5px 6px 8px;
                        margin-right:0px;
                        .iconWrap{
                            background: #efefef;
                            display: inline-block;
                            width: 30px;
                            height: 30px;
                            line-height: 30px;
                            text-align: center;
                            border-radius: 50%;
                            color: #44ace8;
                            margin-left: 8px;
                            font-size:10px;
                        }
                        .ivu-icon-ios-folder{
                            font-size: 18px;
                            margin-left: 8px;
                            margin-right: 8px;
                            color: #73c8ea;
                        }
                        
                    }
                    .rightBtn{
                        font-size: 14px;
                        color: #38adff;
                        cursor: pointer;
                        padding-right:8px;
                        >img{
                            height: 15px;
                            margin-bottom: -2px;
                            margin-right: 4px;
                        }
                    }
                    .rightBtnDisabled{
                        font-size: 14px;
                        color: #c5c5c5;
                        cursor: pointer;
                        padding-right:8px;
                        >img{
                            height: 15px;
                            margin-bottom: -2px;
                            margin-right: 4px;
                        }
                    }
                    
                }
                .contentOrgWrap{
                     .uncheckboxWrap{
                        padding-left:0px;
                        .checkboxLabel{
                            padding-left:0px;
                        }
                    }
                }
                .unCheckboxGroupWrap{
                    .checkboxLabel{
                        padding-left:0px;
                    }
                    .checkboxLabel:hover{
                        background:#eaeaea;
                    }
                }
                .checkboxWrap:hover{
                    background: rgba(240,240,240,0.9);
                    .iconWrap{
                        background:rgba(255,255,255,0.9)
                    }
                }
            }
            .selector_right{
                width: 45%;
                padding-left: 15px;
                .resultWrap{
                    overflow-y:auto;
                    border: 1px solid #efefef;
                    border-radius: 4px;
                    margin: 8px 0px 0px 0px;
                    .resultBox{
                        padding: 8px 12px;
                        font-size: 14px;
                        .ivu-icon-ios-close{
                            font-size:18px;
                        }
                        .iconWrap{
                            background: #efefef;
                            display: inline-block;
                            width: 30px;
                            height: 30px;
                            line-height: 30px;
                            text-align: center;
                            border-radius: 50%;
                            color: #44ace8;
                            margin-right: 8px;
                            font-size:10px;
                            cursor:pointer;
                        }
                    }
                    .resultBox:hover{
                        background:#eaeaea;
                        .iconWrap{
                            background:rgba(255,255,255,0.9)
                        }
                    }

                }
            }

        }
    }
</style>
