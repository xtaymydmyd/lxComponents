<template>
    <div class="roleContentWrap overflowYAuto" :style="{height : height}">
       <div  v-for="(list , i ) in groupList" :key="list.id + '' + i" class="flex flex-align-items"  @click="changeCheck(i , 4)">
            <label class="checkboxLabel flex flex-align-items ivu-checkbox-wrapper ivu-checkbox-group-item ivu-checkbox-default">
                <span class="ivu-checkbox" :class="{'ivu-checkbox-checked' : list.check}">
                    <span class="ivu-checkbox-inner"></span> 
                </span> 
                <i class="ivu-icon ivu-icon-md-person"></i> 
                <span>{{list.name}}</span>
            </label>
        </div>
        <div v-show="(groupList.length == 0 && !groupLoading)" style="text-align: center;color: #999;padding: 10px;">
            暂无数据
        </div>
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
            groupLoading : true,
            checkAllGroup : [],
            config : {},
            condition : {},
            result : [],
            fuzzy : '',
            groupList : []
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

            this.groupLoading = true;
            this.getGroupList();
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
                            res.data[i].type = 4;
                            res.data[i].check = false;
                            res.data[i].id = res.data[i].groupId;
                        }
                        this.groupList = res.data;
                        this.initCheck();
                        this.groupLoading = false;
                    }
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
        initCheck(){
            for(var i = 0 ; i < this.result.length ; i++){
                for(var k = 0 ; k < this.groupList.length ; k++){
                    if(this.result[i].id == this.groupList[k].id){
                        this.groupList[k].check = true;
                    }
                }
            }
            this.groupList.push()
        },
        changeCheck(index){ 
            this.$emit("group-check-change", this.groupList[index] , this.groupList[index].check , 4)
        },
        /**
         * 设置选中
        */
        setCheckStatus(result){
            this.result = result;
            if(this.config.muliteChoice == 1){
                for(var i = 0 ; i < this.groupList.length ; i++){
                    this.groupList[i].check = false;
                }
                for(var i = 0 ; i < this.result.length ; i++){
                    for(var j = 0 ; j < this.groupList.length ; j++){
                        if(this.result[i].id == this.groupList[j].id){
                            this.groupList[j].check = true;
                        }
                    }
                }
                this.groupList.push()
            }else if(this.config.muliteChoice == 2) {
                for(var i = 0 ; i < this.groupList.length ; i++){
                    this.groupList[i].check = false;
                }
                for(var i = 0 ; i < this.result.length ; i++){
                    for(var j = 0 ; j < this.groupList.length ; j++){
                        if(this.result[i].id == this.groupList[j].id){
                            this.groupList[j].check = true;
                        }
                    }
                }
               this.groupList.push()
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
    @import '~assets/css/flex.scss';
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
                .checkboxLabel:hover{
                    background:rgba(240,240,240,0.9);
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
