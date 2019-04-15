<template>
    <Modal 
        class="selectComponent"
        width="700"
        v-model="selectModal"
        :title="config.title"
        @on-cancel="cancel">
        <div class="selector flex">
            <div class="selector_left flex flex-direction-column">
                <Input v-model="fuzzy" icon="md-search" placeholder="请输入" clearable @on-enter="enter"/>
                <div class="flex-1 selector_left_content">
                    <Tabs type="card" :value="value" :animated="false" @on-click="changeTab" v-if="(condition.org && condition.role && !condition.charge) || (condition.org && !condition.role && condition.charge) || (!condition.org && condition.role && condition.charge) || (condition.org && condition.role && condition.charge)">
                        <TabPane label="组织结构" name="org" v-if="condition.org">
                            <org :config="config" ref="org" @org-check-change=checkChange></org>
                        </TabPane>
                        <TabPane label="角色列表" name="role" v-if="condition.role">
                            <role ref="role" @role-check-change=checkChange></role>
                        </TabPane>
                        <TabPane label="主管" name="charge" v-if="condition.charge">
                            <charge ref="charge" @charge-check-change=checkChange></charge>
                        </TabPane>
                    </Tabs>
                    <org :config="config" ref="org" @org-check-change=checkChange v-if="condition.org && !condition.role && !condition.charge"></org>
                    <role ref="role" @role-check-change=checkChange v-if="!condition.org && condition.role && !condition.charge"></role>
                    <charge ref="charge" @charge-check-change=checkChange v-if="!condition.org && !condition.role && condition.charge"></charge>
                </div>
            </div>
            <div class="selector_right flex flex-direction-column">
                <div class="selector_right_text flex">
                    <span class="flex-1">已选：</span>
                    <span class="clear-wrap" v-show="result.length > 0" @click="clearResult()"><Icon type="ios-trash-outline" /> <span>清空</span></span>
                </div>
                <div class="resultWrap flex-1">
                    <div class="resultBox flex flex-align-items" v-for="(item , i) in result" :key="i">
                        <i class="ivu-icon ivu-icon-ios-folder" v-if="item.type == 1 || item.type == 6"></i> 
                        <i class="ivu-icon ivu-icon-md-person" v-if="item.type == 3 || item.type == 4 || item.type == 5"></i> 
                        <span class="iconWrap" v-if="item.type == 2">{{getShortName(item.label)}}</span> 
                        <div class="resultName flex-1">{{item.label}}</div>
                        <Icon type="ios-close" @click="deleteResult(i)"/>
                    </div>
                </div>
            </div>
        </div>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" @click="submit">确定</Button>
        </div>
    </Modal>
</template>

<script>
import org from './components/org.vue'
import role from './components/role.vue'
import charge from './components/charge.vue'
export default {
    name: 'index',
     data(){
        return {
            value : 'charge',
            selectModal : false,
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
            formItem:{
                status:"",
            },
            title : '选择',
            fuzzy : '',
            collapseVal : '1',
            result : []
        }
    },
    components : {
        org,
        role,
        charge
    },
    methods : {
        /**
         * 打开选择器
        */
        open(config) {
            this.config = config;
            this.config.type = this.config.type ? this.config.type : 1;
            this.config.title = this.config.title ? this.config.title : '选择成员';
            this.config.muliteChoice = this.config.muliteChoice ? this.config.muliteChoice : 1
            this.result = this.config.data ? this.config.data : [];
            if(this.config.muliteChoice == 2){
                if(this.result.length > 1){
                    var arr = JSON.parse(JSON.stringify(this.result[0]))
                    this.result = [arr]
                }
            }
            this.selectModal = true;
            
            this.initCondition();
        },
        enter(){
            if(this.value == 'org'){
                this.$refs.org.init(this.config , this.condition , this.fuzzy , JSON.parse(JSON.stringify(this.result)));
            }else if(this.value == 'role'){
                this.$refs.role.init(this.config , this.condition , this.fuzzy , JSON.parse(JSON.stringify(this.result)));
            }else if(this.value == 'group'){
                this.$refs.charge.init(this.config , this.condition , this.fuzzy , JSON.parse(JSON.stringify(this.result)));
            }
        },
        changeTab(value){
            this.value = value;
            this.fuzzy = '';
            if(this.condition.org){
                this.$refs.org.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 1);
                this.$refs.org.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 2);
            }
            if(this.condition.role){
                this.$refs.role.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 3)
                this.$refs.role.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 4)
                this.$refs.role.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 5)
            }
            if(this.condition.charge){
                this.$refs.charge.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 6)
            }
        },
        /**
         * 初始化选择器的条件
        */
        initCondition(){
            if(this.config.condition.length > 0){
                for(var i = 0 ; i < this.config.condition.length ; i++){
                    this.condition[this.config.condition[i]] = true;
                }
            }
            this.value = this.condition.org ? 'org' : this.condition.role ? 'role' : 'charge' 
            this.$nextTick(function(){
                this.initConditionData();
            })  
            
        },
        /**
         * 初始化选择器中第一个条件的事件
        */
        initConditionData(){
            if(this.condition.org){
                this.$refs.org.allStatus = false;
                this.$refs.org.init(this.config , this.condition , this.fuzzy , JSON.parse(JSON.stringify(this.result)));
            }
            if(this.condition.role){
                this.$refs.role.init(this.config , this.condition , this.fuzzy , JSON.parse(JSON.stringify(this.result)));
            }
            if(this.condition.charge){
                this.$refs.charge.init(this.config , this.condition , this.fuzzy , JSON.parse(JSON.stringify(this.result)));
            }
        },
        /**
         * 组织结构中部门及人员选中状态发生改变
        */
        checkChange(item , status , type){
            if(this.config.muliteChoice == 1){ // 多选
                if(!status){
                    var param = {
                        label : item.name,
                        id : item.id,
                        type : type
                    }
                    var flag = false;
                    for(var i = 0 ; i < this.result.length ; i++){
                        if(param.id == this.result[i].id){
                            flag = true;
                            break
                        }
                    }
                    if(!flag){
                        this.result.push(param)
                    }
                }else{ 
                    for(var i = 0 ; i < this.result.length ; i++){
                        if(item.id == this.result[i].id){
                            this.result.splice(i, 1);
                        }
                    }
                }
            }else if(this.config.muliteChoice == 2){ // 单选
                this.result = [];
                if(!status){
                    this.result = [];
                    var param = {
                        label : item.name,
                        id : item.id,
                        type : type
                    }
                    this.result[0] = param;
                }
            }
            if(type == 1) { // 部门状态发生改变时
                this.$refs.org.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 1)
            }else if(type == 2) { // 人员状态发生改变时
                this.$refs.org.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 2)
            }else if(type == 3 || type == 4 || type == 5){
                this.$refs.role.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , type)
            }else if(type == 6){
                this.$refs.charge.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 6)
            }
        }, 
        clearResult(){
            for(var i = 0 ; i < this.result.length ; i++){
                var info = this.result[i];
                this.result.splice(i, 1);
                i--;
                if( info.type == 1 ) { //删除部门
                    this.$refs.org.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 1)
                }else if( info.type == 2 ) {
                    this.$refs.org.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 2)
                }else if(info.type == 3 || info.type == 4 || info.type == 5){
                    this.$refs.role.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , info.type)
                }else if(info.type == 6){
                    this.$refs.charge.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 6)
                }
            }
        },
        /**
         * 删除某条结果
        */
        deleteResult(index){
            var info = JSON.parse(JSON.stringify(this.result[index]))
            this.result.splice(index, 1);
            if( info.type == 1 ) { //删除部门
                this.$refs.org.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 1)
            }else if( info.type == 2 ) {
                this.$refs.org.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 2)
            }else if(info.type == 3 || info.type == 4 || info.type == 5){
                this.$refs.role.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , info.type)
            }else if(info.type == 6){
                this.$refs.charge.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 6)
            }
        },
        submit(){
            if(this.result.length == 0) {
                return;
            }
            this.selectModal = false;
            this.$emit("on-submit" , JSON.parse(JSON.stringify(this.result)));
        },
        cancel(){
            this.selectModal = false;
            this.$emit("on-cancel" , JSON.parse(JSON.stringify(this.result)));
        },
        getShortName(name){
            if(name.length < 2){
                return name
            }else{
                return name.slice(name.length - 2 , name.length)
            }
            
        },
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
            .clear-wrap{
                color: #666;
                font-size: 12px;
                margin-left: -4px;
                cursor:pointer;
                .ivu-icon{
                    font-size: 18px;
                }
            }
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
                .ivu-collapse-content{
                    padding:0px;
                    .ivu-collapse-content-box{
                        padding:5px 0px;
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
                        padding: 8px 12px 5px 12px;
                        font-size: 14px;
                        .ivu-icon-ios-folder , .ivu-icon-md-person{
                            font-size: 18px;
                            margin-right: 8px;
                            color: #73c8ea;
                        }
                        .ivu-icon-ios-close{
                            font-size:18px;
                        }
                        .iconWrap{
                            background: #efefef;
                            display: inline-block;
                            width: 28px;
                            height: 28px;
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
