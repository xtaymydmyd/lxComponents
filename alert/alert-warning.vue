<template>
    <div class="alert sweet-alert">
         <div v-transfer-dom>
            <x-dialog 
                v-model="show" 
                :hide-on-blur="hideOnBlur" 
                :mask-transition="maskTransition" 
                @on-hide="$emit('on-hide')"
                @on-show="$emit('on-show')"
                class="dialog-demo sweet-alert">
                <div class="sweet-alert-content">
                    <div class="icon warning pulseWarning" style="display: block;"> 
                        <span class="body pulseWarningIns"></span>
                        <span class="dot pulseWarningIns"></span> 
                    </div>
                    <div class="sweet-alert-text">{{text}}</div>
                </div>
            </x-dialog>
        </div>
    </div>
</template>

<script>
    import { XDialog , TransferDomDirective as TransferDom  } from 'vux'
    export default {
        name: 'alertError',
        data() {
            return {
                show : false
            }
        },
        watch: {
            value: {
                handler: function (val) {
                    this.show = val;
                    if(val && this.timeout){
                        this._bindTimeOutEvent()
                    }
                },
                immediate: true
            }
        },
        components: {
            XDialog
        },
        props: {
            value: Boolean,
            text : {
                type : String ,
                default : '操作成功'
            },
            hideOnBlur: {//是否在点击遮罩时自动关闭弹窗
                type: Boolean,
                default: false
            },
            maskTransition: {//	遮罩层动画
                type: String,
                default: 'vux-fade'
            },
            timeout:{
                type:Number,
            }
        },
        directives: {
            TransferDom
        },
        methods: {
            _bindTimeOutEvent(){
                var _this = this;
                var time = this.timeout * 1000
                setTimeout(() => {
                    _this.$emit("on-hide")
                }, time)
            }
        },
    }
</script>
<style lang="scss">
    .sweet-alert{
        .weui-dialog{
            width: 200px;
            .sweet-alert-content{
                padding:25px 20px 60px 20px;
                position:relative;
                .sweet-alert-text{
                    color: #575757;
                    margin-top: 15px;
                    position: absolute;
                    width: 100%;
                    text-align: center;
                    left: 0px;
                    font-size: 20px;
                    font-weight: bold;
                    padding: 0px 10px;
                    box-sizing: border-box;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
    }
    
</style>


<style lang="scss" scoped>
    .sweet-alert[data-has-cancel-button=false] button {
        box-shadow: none !important;
    }

    .sweet-alert .icon {
        width: 80px;
        height: 80px;
        border: 4px solid gray;
        border-radius: 50%;
        padding: 20px auto;
        position: relative;
        box-sizing: content-box;
        margin:auto;
    }

    .sweet-alert .icon.error {
        border-color: #F27474;
    }

    .sweet-alert .icon.error .x-mark {
        position: relative;
        display: block;
    }

    .sweet-alert .icon.error .line {
        position: absolute;
        height: 5px;
        width: 47px;
        background-color: #F27474;
        display: block;
        top: 37px;
        border-radius: 2px;
    }

    .sweet-alert .icon.error .line.left {
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        left: 17px;
    }

    .sweet-alert .icon.error .line.right {
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg);
        right: 16px;
    }

    .sweet-alert .icon.warning {
        border-color: #F8BB86;
    }

    .sweet-alert .icon.warning .body {
        position: absolute;
        width: 5px;
        height: 47px;
        left: 50%;
        top: 10px;
        border-radius: 2px;
        margin-left: -2px;
        background-color: #F8BB86;
    }

    .sweet-alert .icon.warning .dot {
        position: absolute;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        margin-left: -3px;
        left: 50%;
        bottom: 10px;
        background-color: #F8BB86;
    }

    .sweet-alert .icon.info {
        border-color: #C9DAE1;
    }

    .sweet-alert .icon.info::before {
        content: "";
        position: absolute;
        width: 5px;
        height: 29px;
        left: 50%;
        bottom: 17px;
        border-radius: 2px;
        margin-left: -2px;
        background-color: #C9DAE1;
    }

    .sweet-alert .icon.info::after {
        content: "";
        position: absolute;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        margin-left: -3px;
        top: 19px;
        background-color: #C9DAE1;
    }

    .sweet-alert .icon.success {
        border-color: #A5DC86;
    }

    .sweet-alert .icon.success::before,
    .sweet-alert .icon.success::after {
        content: '';
        border-radius: 50%;
        position: absolute;
        width: 60px;
        height: 120px;
        background: white;
        transform: rotate(45deg);
    }

    .sweet-alert .icon.success::before {
        border-radius: 120px 0 0 120px;
        top: -7px;
        left: -33px;
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg);
        -webkit-transform-origin: 60px 60px;
        transform-origin: 60px 60px;
    }

    .sweet-alert .icon.success::after {
        border-radius: 0 120px 120px 0;
        top: -11px;
        left: 30px;
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg);
        -webkit-transform-origin: 0px 60px;
        transform-origin: 0px 60px;
    }

    .sweet-alert .icon.success .placeholder {
        width: 80px;
        height: 80px;
        border: 4px solid rgba(165, 220, 134, 0.2);
        border-radius: 50%;
        box-sizing: content-box;
        position: absolute;
        left: -4px;
        top: -4px;
        z-index: 2;
    }

    .sweet-alert .icon.success .fix {
        width: 5px;
        height: 90px;
        background-color: white;
        position: absolute;
        left: 28px;
        top: 8px;
        z-index: 1;
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg);
    }

    .sweet-alert .icon.success .line {
        height: 5px;
        background-color: #A5DC86;
        display: block;
        border-radius: 2px;
        position: absolute;
        z-index: 2;
    }

    .sweet-alert .icon.success .line.tip {
        width: 25px;
        left: 14px;
        top: 46px;
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
    }

    .sweet-alert .icon.success .line.long {
        width: 47px;
        right: 8px;
        top: 38px;
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg);
    }

    .sweet-alert .icon.custom {
        background-size: contain;
        border-radius: 0;
        border: none;
        background-position: center center;
        background-repeat: no-repeat;
    }

    @-webkit-keyframes animateSuccessTip {
        0% {
            width: 0;
            left: 1px;
            top: 19px;
        }

        54% {
            width: 0;
            left: 1px;
            top: 19px;
        }

        70% {
            width: 50px;
            left: -8px;
            top: 37px;
        }

        84% {
            width: 17px;
            left: 21px;
            top: 48px;
        }

        100% {
            width: 25px;
            left: 14px;
            top: 45px;
        }
    }

    @-moz-keyframes animateSuccessTip {
        0% {
            width: 0;
            left: 1px;
            top: 19px;
        }

        54% {
            width: 0;
            left: 1px;
            top: 19px;
        }

        70% {
            width: 50px;
            left: -8px;
            top: 37px;
        }

        84% {
            width: 17px;
            left: 21px;
            top: 48px;
        }

        100% {
            width: 25px;
            left: 14px;
            top: 45px;
        }
    }

    @keyframes animateSuccessTip {
        0% {
            width: 0;
            left: 1px;
            top: 19px;
        }

        54% {
            width: 0;
            left: 1px;
            top: 19px;
        }

        70% {
            width: 50px;
            left: -8px;
            top: 37px;
        }

        84% {
            width: 17px;
            left: 21px;
            top: 48px;
        }

        100% {
            width: 25px;
            left: 14px;
            top: 45px;
        }
    }

    @-webkit-keyframes animateSuccessLong {
        0% {
            width: 0;
            right: 46px;
            top: 54px;
        }

        65% {
            width: 0;
            right: 46px;
            top: 54px;
        }

        84% {
            width: 55px;
            right: 0px;
            top: 35px;
        }

        100% {
            width: 47px;
            right: 8px;
            top: 38px;
        }
    }

    @-moz-keyframes animateSuccessLong {
        0% {
            width: 0;
            right: 46px;
            top: 54px;
        }

        65% {
            width: 0;
            right: 46px;
            top: 54px;
        }

        84% {
            width: 55px;
            right: 0px;
            top: 35px;
        }

        100% {
            width: 47px;
            right: 8px;
            top: 38px;
        }
    }

    @keyframes animateSuccessLong {
        0% {
            width: 0;
            right: 46px;
            top: 54px;
        }

        65% {
            width: 0;
            right: 46px;
            top: 54px;
        }

        84% {
            width: 55px;
            right: 0px;
            top: 35px;
        }

        100% {
            width: 47px;
            right: 8px;
            top: 38px;
        }
    }

    @-webkit-keyframes rotatePlaceholder {
        0% {
            transform: rotate(-45deg);
            -webkit-transform: rotate(-45deg);
        }

        5% {
            transform: rotate(-45deg);
            -webkit-transform: rotate(-45deg);
        }

        12% {
            transform: rotate(-405deg);
            -webkit-transform: rotate(-405deg);
        }

        100% {
            transform: rotate(-405deg);
            -webkit-transform: rotate(-405deg);
        }
    }

    @-moz-keyframes rotatePlaceholder {
        0% {
            transform: rotate(-45deg);
            -webkit-transform: rotate(-45deg);
        }

        5% {
            transform: rotate(-45deg);
            -webkit-transform: rotate(-45deg);
        }

        12% {
            transform: rotate(-405deg);
            -webkit-transform: rotate(-405deg);
        }

        100% {
            transform: rotate(-405deg);
            -webkit-transform: rotate(-405deg);
        }
    }

    @keyframes rotatePlaceholder {
        0% {
            transform: rotate(-45deg);
            -webkit-transform: rotate(-45deg);
        }

        5% {
            transform: rotate(-45deg);
            -webkit-transform: rotate(-45deg);
        }

        12% {
            transform: rotate(-405deg);
            -webkit-transform: rotate(-405deg);
        }

        100% {
            transform: rotate(-405deg);
            -webkit-transform: rotate(-405deg);
        }
    }

    .animateSuccessTip {
        -webkit-animation: animateSuccessTip 0.75s;
        -moz-animation: animateSuccessTip 0.75s;
        animation: animateSuccessTip 0.75s;
    }

    .animateSuccessLong {
        -webkit-animation: animateSuccessLong 0.75s;
        -moz-animation: animateSuccessLong 0.75s;
        animation: animateSuccessLong 0.75s;
    }

    .icon.success.animate::after {
        -webkit-animation: rotatePlaceholder 4.25s ease-in;
        -moz-animation: rotatePlaceholder 4.25s ease-in;
        animation: rotatePlaceholder 4.25s ease-in;
    }

    @-webkit-keyframes animateErrorIcon {
        0% {
            transform: rotateX(100deg);
            -webkit-transform: rotateX(100deg);
            opacity: 0;
        }

        100% {
            transform: rotateX(0deg);
            -webkit-transform: rotateX(0deg);
            opacity: 1;
        }
    }

    @-moz-keyframes animateErrorIcon {
        0% {
            transform: rotateX(100deg);
            -webkit-transform: rotateX(100deg);
            opacity: 0;
        }

        100% {
            transform: rotateX(0deg);
            -webkit-transform: rotateX(0deg);
            opacity: 1;
        }
    }

    @keyframes animateErrorIcon {
        0% {
            transform: rotateX(100deg);
            -webkit-transform: rotateX(100deg);
            opacity: 0;
        }

        100% {
            transform: rotateX(0deg);
            -webkit-transform: rotateX(0deg);
            opacity: 1;
        }
    }

    .animateErrorIcon {
        -webkit-animation: animateErrorIcon 0.5s;
        -moz-animation: animateErrorIcon 0.5s;
        animation: animateErrorIcon 0.5s;
    }

    @-webkit-keyframes animateXMark {
        0% {
            transform: scale(0.4);
            -webkit-transform: scale(0.4);
            margin-top: 26px;
            opacity: 0;
        }

        50% {
            transform: scale(0.4);
            -webkit-transform: scale(0.4);
            margin-top: 26px;
            opacity: 0;
        }

        80% {
            transform: scale(1.15);
            -webkit-transform: scale(1.15);
            margin-top: -6px;
        }

        100% {
            transform: scale(1);
            -webkit-transform: scale(1);
            margin-top: 0;
            opacity: 1;
        }
    }

    @-moz-keyframes animateXMark {
        0% {
            transform: scale(0.4);
            -webkit-transform: scale(0.4);
            margin-top: 26px;
            opacity: 0;
        }

        50% {
            transform: scale(0.4);
            -webkit-transform: scale(0.4);
            margin-top: 26px;
            opacity: 0;
        }

        80% {
            transform: scale(1.15);
            -webkit-transform: scale(1.15);
            margin-top: -6px;
        }

        100% {
            transform: scale(1);
            -webkit-transform: scale(1);
            margin-top: 0;
            opacity: 1;
        }
    }

    @keyframes animateXMark {
        0% {
            transform: scale(0.4);
            -webkit-transform: scale(0.4);
            margin-top: 26px;
            opacity: 0;
        }

        50% {
            transform: scale(0.4);
            -webkit-transform: scale(0.4);
            margin-top: 26px;
            opacity: 0;
        }

        80% {
            transform: scale(1.15);
            -webkit-transform: scale(1.15);
            margin-top: -6px;
        }

        100% {
            transform: scale(1);
            -webkit-transform: scale(1);
            margin-top: 0;
            opacity: 1;
        }
    }

    .animateXMark {
        -webkit-animation: animateXMark 0.5s;
        -moz-animation: animateXMark 0.5s;
        animation: animateXMark 0.5s;
    }

    @-webkit-keyframes pulseWarning {
        0% {
            border-color: #F8D486;
        }

        100% {
            border-color: #F8BB86;
        }
    }

    @-moz-keyframes pulseWarning {
        0% {
            border-color: #F8D486;
        }

        100% {
            border-color: #F8BB86;
        }
    }

    @keyframes pulseWarning {
        0% {
            border-color: #F8D486;
        }

        100% {
            border-color: #F8BB86;
        }
    }

    .pulseWarning {
        -webkit-animation: pulseWarning 0.75s infinite alternate;
        -moz-animation: pulseWarning 0.75s infinite alternate;
        animation: pulseWarning 0.75s infinite alternate;
    }

    @-webkit-keyframes pulseWarningIns {
        0% {
            background-color: #F8D486;
        }

        100% {
            background-color: #F8BB86;
        }
    }

    @-moz-keyframes pulseWarningIns {
        0% {
            background-color: #F8D486;
        }

        100% {
            background-color: #F8BB86;
        }
    }

    @keyframes pulseWarningIns {
        0% {
            background-color: #F8D486;
        }

        100% {
            background-color: #F8BB86;
        }
    }
</style>