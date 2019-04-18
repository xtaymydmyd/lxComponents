<template>
    <div class="overflowYAuto" :style="{height : height}">
        <div v-for="(item , i) in list" :key="i" :label="item.id" class="checkboxLabel flex flex-align-items" @click="changeCheck(i , 5)">
            <label class="flex-1 flex-align-items ivu-checkbox-wrapper ivu-checkbox-group-item ivu-checkbox-default " >
                <span class="ivu-checkbox " :class="{'ivu-checkbox-checked' : item.check}">
                    <span class="ivu-checkbox-inner"></span> 
                </span> 
                <i class="ivu-icon ivu-icon-ios-folder"></i> 
                <span class="name">{{item.name}}</span>
            </label>
        </div>
    </div>
</template>

<script>
export default {
    name: 'index',
     data(){
        return {
            height: "329px",
            list : [],
            condition : {}
        }
    },
    methods : {
        init(config , condition , fuzzy , result){
            this.config = config;
            this.condition = condition;
            this.height = this.showTab() ? "329px" : '370px';
            this.result = result;
            this.fuzzy = fuzzy;
            this.getChargeList();
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
        getChargeList(){
            if(this.config.chargeLevel){
                this.config.chargeLevel = 10;
            }
            for(var i = 0 ; i < this.config.chargeLevel ; i++){
                var param = {
                    name : '第' + (i + 1) + '级主管',
                    id : 'charge' + i,
                    check : false
                }
                if(i == 0){
                    param.name = '直接主管'
                }
                this.list.push(param)
            }
            this.initCheck();
        },
        /**
         * 改变状态
        */
        setCheckStatus(result , type){
            this.result = result;
            for(var i = 0 ; i < this.list.length ; i++){
                this.list[i].check = false;
            }
            for(var i = 0 ; i < this.result.length ; i++){
                for(var j = 0 ; j < this.list.length ; j++){
                    if(this.result[i].id == this.list[j].id){
                        this.list[j].check = true;
                    }
                }
            }
            this.list.push()
            
        },
        initCheck(){
            for(var i = 0 ; i < this.result.length ; i++){
                for(var j = 0 ; j < this.list.length ; j++){
                    if(this.result[i].type == 6 && this.result[i].id == this.list[j].id){
                        this.list[j].check = true;
                    }
                }
            }
            this.list.push()
        },
        changeCheck(index){
            this.$emit("charge-check-change", this.list[index] , this.list[index].check , 5)
        }
    }
}
</script>

<style lang="scss">
    @import "../assets/charge.scss"
</style>
