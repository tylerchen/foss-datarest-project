<script>
    export default {
        methods: {
            remove(url) {
                if(confirm("确定要删除记录？")) {
                    this.$http.get(url)
                            .then((response) => {
                        if(response.data == 1) {
                        this.$Message.success('删除成功!')

                        // 通知父组件刷新列表
                        this.$dispatch('refresh-list');

                        } else {
                            this.$Message.error('删除失败!')
                        }
                    })
                    .catch(function(response) {
                        console.log(response)
                    })
                }
            }
        },
        events: {
            'remove': function (url) {
                this.remove(url)
            }
        }
    }
</script>