define([ 'vue', 'html!views/queryStatement/editQueryStatement.html', 'globalConst' ],
    function(Vue, html, globalConst) {

    const MODULE = globalConst.QUERY_STATEMENT

    return {
        template : html,
        data () {
            return {
                model: {},
                ruleValidate: {
                    selectBody: [
                        {required: true, message: '显示字段不能为空', trigger: 'blur'}
                    ],
                    fromBody: [
                        {required: true, message: '数据表不能为空', trigger: 'blur'}
                    ],
                    whereBody: [
                        {required: true, message: '查询条件不能为空', trigger: 'blur'}
                    ]
                }
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
                    });
            },
            update (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var params = "queryStatement=" + encodeURIComponent(JSON.stringify(this.model))
                        this.$http.post(MODULE.URL.UPDATE, params)
                            .then((response) => {
                                this.goback()
                                this.$Message.success('修改成功!')
                            })
                            .catch((error) => {
                                console.log(error)
                                this.$Message.error('修改失败!')
                            })
                    } else {
                        this.$Message.error('表单验证失败!')
                    }
                })
            },
            goback () {
                this.$router.push(MODULE.ROUTER.LIST)
            }
        }
    }
})