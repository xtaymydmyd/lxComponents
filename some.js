// var obj = {
//     template: '<div style="color:#fff" @click="test">I am async!</div>',
//     methods: {
//         // 点我了
//         test() {
//             this.$router.push({
//                 path: '/'
//             })
//             console.log('点我了', this.$router)
//         }
//     }
// }

// export default obj



// const code =
// `<template>
//     <div class="default_code">
//         <input v-model="message">
//         {{ message }}
//         <div @click="test()">点击</div>
//     </div>
// </template>
// <script>
//     export default {
//         data () {
//             return {
//                 message: '',
//                 percent1: 30,
//             }
//         },
//         methods:{
//             test(){
//                 this.$vux.toast.text('hello', 'top')
//             }
//         }
      
//     }
// </script>
// <style lang="scss">
//     .default_code{
//         border:1px solid #eaeaea;
//         padding:20px 30px;
//     }
//     input{
//         padding:15px 20px;
//         border:1px solid red;
//         border-radius:3px;
//     }
// </style>`

// export default code


; (function () {
    var defaultCode =
    `<template>
        <div class="default_code">
            <input v-model="message">
            {{ message }}
            <div @click="test()">点击</div>
        </div>
    </template>
    <script>
        export default {
            data () {
                return {
                    message: '',
                    percent1: 30,
                }
            },
            methods:{
                test(){
                    this.$vux.toast.text('hello', 'top')
                }
            }
        
        }
    </script>
    <style lang="scss">
        .default_code{
            border:1px solid #eaeaea;
            padding:20px 30px;
        }
        input{
            padding:15px 20px;
            border:1px solid red;
            border-radius:3px;
        }
    </style>`
    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = defaultCode;
    } else {
        window.defaultCode = defaultCode;
    }
})();