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
                <div class="flex-1 selector_left_content" v-show="config.model == 1">
                    <Tabs type="card" :value="value" :animated="false" @on-click="changeTab" v-if="showTab()">
                        <TabPane label="组织结构" name="org" v-if="condition.org">
                            <org :config="config" ref="org" @org-check-change=checkChange></org>
                        </TabPane>
                        <TabPane label="角色列表" name="role" v-if="condition.role">
                            <role ref="role" @role-check-change=checkChange></role>
                        </TabPane>
                        <TabPane label="群组列表" name="group" v-if="condition.group">
                            <group ref="group" @group-check-change=checkChange></group>
                        </TabPane>
                        <TabPane label="岗位列表" name="post" v-if="condition.post">
                            <post ref="post" @post-check-change=checkChange></post>
                        </TabPane>
                        <TabPane label="主管" name="charge" v-if="condition.charge">
                            <charge ref="charge" @charge-check-change=checkChange></charge>
                        </TabPane>
                    </Tabs>
                    <org :config="config" ref="org" @org-check-change=checkChange v-if="showTabForOne('org')"></org>
                    <role ref="role" @role-check-change=checkChange v-if="showTabForOne('role')"></role>
                    <charge ref="charge" @charge-check-change=checkChange v-if="showTabForOne('charge')"></charge>
                    <group ref="group" @group-check-change=checkChange v-if="showTabForOne('group')"></group>
                    <post ref="post" @post-check-change=checkChange v-if="showTabForOne('post')"></post>
                </div>
                <div v-show="config.model == 2" class="selector_left_content">
                    <list ref="list" @list-check-change="checkChange"></list>
                </div>
            </div>
            <div class="selector_right flex flex-direction-column">
                <div class="selector_right_text flex">
                    <span class="flex-1">已选：</span>
                    <span class="clear-wrap flex flex-align-items" v-show="result.length > 0" @click="clearResult()"><Icon type="ios-trash-outline" /> <span>清空</span></span>
                </div>
                <div class="resultWrap flex-1">
                    <div class="resultBox flex flex-align-items" v-for="(item , i) in result" :key="i">
                        <i class="ivu-icon ivu-icon-ios-folder" v-if="item.type == 0 || item.type == 5"></i> 
                        <i class="ivu-icon ivu-icon-md-person" v-if="item.type == 2 || item.type == 3 || item.type == 4"></i> 
                        <span class="iconWrap" v-if="item.type == 1">{{getShortName(item.label)}}</span> 
                        <div class="resultName flex-1">{{item.label}}</div>
                        <Icon type="ios-close" @click="deleteResult(i)"/>
                        <!-- {{item.type}} -->
                    </div>
                </div>
            </div>
        </div>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" @click="submit" :disabled="result.length == 0" v-if="config.require == 2">确定</Button>
            <Button type="primary" @click="submit" v-if="config.require == 1">确定</Button>
        </div>
    </Modal>
</template>

<script>
import org from './components/org.vue'
import role from './components/role.vue'
import group from './components/group.vue'
import post from './components/post.vue'
import charge from './components/charge.vue'
import list from './components/list.vue'
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
        charge,
        group,
        post,
        list
    },
    methods : {
        /**
         * 打开选择器
        */
        open(config) {
            this.config = config;
            this.config.model = this.config.model ? this.config.model : 1;
            this.config.type = this.config.type ? this.config.type : 1;
            this.config.require = this.config.require ? this.config.require : 1;
            if(this.config.model == 1 && !this.config.deptId) {
                common.toastMsg('参数出错');
                return; 
            }
            if(this.config.model == 2 && !this.config.roleList){
                common.toastMsg('参数出错');
                return;
            } 
            this.config.roleList = this.config.roleList ? this.config.roleList : [];

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
        showTab(){
            var num = 0
            if(this.condition.org){
                num ++;
            }
            if(this.condition.role){
                num ++;
            }
            if(this.condition.group){
                num ++;
            }
            if(this.condition.post){
                num ++;
            }
            if(this.condition.charge){
                num ++;
            }
            return num > 1 ? true : false
        },
        showTabForOne(key){
            if(!this.showTab()){
                return this.condition[key]
            }
        },
        enter(){
            if(this.value == 'org'){
                this.$refs.org.init(this.config , this.condition , this.fuzzy , JSON.parse(JSON.stringify(this.result)));
            }else if(this.value == 'role'){
                this.$refs.role.init(this.config , this.condition , this.fuzzy , JSON.parse(JSON.stringify(this.result)));
            }else if(this.value == 'charge'){
                this.$refs.charge.init(this.config , this.condition , this.fuzzy , JSON.parse(JSON.stringify(this.result)));
            }else if(this.value == 'group'){
                this.$refs.group.init(this.config , this.condition , this.fuzzy , JSON.parse(JSON.stringify(this.result)));
            }else if(this.value == 'post'){
                this.$refs.post.init(this.config , this.condition , this.fuzzy , JSON.parse(JSON.stringify(this.result)));
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
            }
            if(this.condition.group){
                this.$refs.group.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 4)
            }
            if(this.condition.post){
                this.$refs.post.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 5)
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
            this.value = this.condition.org ? 'org' : this.condition.role ? 'role' : this.condition.group ? 'group' : this.condition.post ? 'post' : 'charge' 
            
            this.$nextTick(function(){
                if(this.config.model == 1){
                    this.initConditionData(); 
                }else if(this.config.model == 2){
                    this.$refs.list.init(this.config , this.condition , this.fuzzy , JSON.parse(JSON.stringify(this.result)));
                }
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
            if(this.condition.group){
                this.$refs.group.init(this.config , this.condition , this.fuzzy , JSON.parse(JSON.stringify(this.result)));
            }
            if(this.condition.post){
                 this.$refs.post.init(this.config , this.condition , this.fuzzy , JSON.parse(JSON.stringify(this.result)));
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
                    if(type == 0 || type == 1){
                        this.$refs.org.allStatus = false;
                        this.$refs.list.allStatus = false;
                    }
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
            if(this.config.model == 1){
                if(type == 0) { // 部门状态发生改变时
                    this.$refs.org.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 0)
                }else if(type == 1) { // 人员状态发生改变时
                    this.$refs.org.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 1)
                }else if(type == 4) { // 角色状态发生改变时
                    this.$refs.role.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 4)
                }else if(type == 3) { // v群组状态发生改变时
                    this.$refs.group.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 3)
                }else if(type == 2) { // 岗位状态发生改变时 
                    this.$refs.post.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 2)
                }else if(type == 5) { // 主管发生改变时
                    this.$refs.charge.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 5)
                }
            }else if(this.config.model == 2){
                this.$refs.list.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 1)
            }
            
        }, 
        clearResult(){
            for(var i = 0 ; i < this.result.length ; i++){
                var info = this.result[i];
                this.result.splice(i, 1);
                i--;
                if(info.type == 0 || info.type == 1){
                    this.$refs.org.allStatus = false;
                    this.$refs.list.allStatus = false;
                }

                if(this.config.model == 1) {
                    if( info.type == 0 ) { //删除部门
                        this.$refs.org.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 0)
                    }else if( info.type == 1 ) {
                        this.$refs.org.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 1)
                    }else if(info.type == 4){
                        this.$refs.role.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 4)
                    }else if(info.type == 3){
                        this.$refs.group.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 3)
                    }else if(info.type == 2){
                        this.$refs.post.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 2)
                    }else if(info.type == 5){
                        this.$refs.charge.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 5)
                    }
                }else if(this.config.model == 2){
                    this.$refs.list.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 1)
                }
                
            }
        },
        /**
         * 删除某条结果
        */
        deleteResult(index){
            var info = JSON.parse(JSON.stringify(this.result[index]))
            this.result.splice(index, 1);
            if(this.config.model == 1){
                if( info.type == 0 ) { //删除部门
                    this.$refs.org.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 0)
                }else if( info.type == 1 ) {
                    this.$refs.org.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 1)
                }else if(info.type == 4){
                        this.$refs.role.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 4)
                }else if(info.type == 3){
                    this.$refs.group.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 3)
                }else if(info.type == 2){
                    this.$refs.post.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 2)
                }else if(info.type == 5){
                    this.$refs.charge.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 5)
                }
            }else if(this.config.model == 2){
                this.$refs.list.setCheckStatus(JSON.parse(JSON.stringify(this.result)) , 1)
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
    @import './assets/select.scss';
</style>
