var obj = {
    template: '<div style="color:#fff" @click="test">I am async!</div>',
    methods: {
        // 点我了
        test() {
            this.$router.push({
                path: '/'
            })
            console.log('点我了', this.$router)
        }
    }
}