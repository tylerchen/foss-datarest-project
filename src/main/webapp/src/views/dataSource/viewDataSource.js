define([ 'vue', 'html!views/dataSource/viewDataSource.html', 'globalConst' ],
    function(Vue, html, globalConst) {

    const MODULE = globalConst.DATA_SOURCE

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

                var id = this.$route.params.id

                var url = MODULE.URL.GET + "/" + id
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