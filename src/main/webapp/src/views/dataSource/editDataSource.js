define([ 'vue', 'html!views/dataSource/editDataSource.html', 'globalConst' ],
    function(Vue, html, globalConst) {

    const MODULE = globalConst.DATA_SOURCE

    return {
        template : html,
        data () {
            return {
                model: {},
                ruleValidate: {
                    driver: [
                        {required: true, message: 'JDBC Driver不能为空', trigger: 'blur'}
                    ],
                    url: [
                        {required: true, message: 'JDBC URL不能为空', trigger: 'blur'}
                    ],
                    user: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ],
                    validationQuery: [
                        {required: true, message: '校验查询语句不能为空', trigger: 'blur'}
                    ],
                    initConnection: [
                        {required: true, message: '初始化连接数不能为空', trigger: 'blur'}
                    ],
                    maxConnection: [
                        {required: true, message: '最大连接数不能为空', trigger: 'blur'}
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
                    .catch(function (response) {
                        console.log(response)
                    });
            },
            update (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var params = "datasource=" + encodeURIComponent(JSON.stringify(this.model))
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
                this.$router.replace(MODULE.ROUTER.LIST)
            }
        }
    }
})