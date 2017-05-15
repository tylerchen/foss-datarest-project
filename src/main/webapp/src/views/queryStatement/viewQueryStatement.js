define([ 'vue', 'html!views/queryStatement/viewQueryStatement.html', 'globalConst' ],
    function(Vue, html, globalConst) {

    const MODULE = globalConst.QUERY_STATEMENT

    return {
        template : html,
        data () {
            return {
                model: {}
            }
        },
        mounted () {
            this.getModelData()
        },
        methods: {
            getModelData () {
                var url = MODULE.URL.GET + "/" + this.$route.params.id
                this.$http.get(url)
                    .then((response) => {
                        var resultData = response.data
                        this.$set(this.$data, 'model', resultData)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            },
            goback () {
                this.$router.push(MODULE.ROUTER.LIST)
            }
        }
    }
})