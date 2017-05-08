const routers = [
    {
        path: '/index',
        component: (resolve) => require(['./views/index.vue'], resolve)
    },
    {
        path: '/data_source_list',
        component: (resolve) => require(['./views/dataSource/listDataSource.vue'], resolve)
    },
    {
        path: '/data_source_add',
        component: (resolve) => require(['./views/dataSource/addDataSource.vue'], resolve)
    },
    {
        path: '/data_source_edit/:id',
        component: (resolve) => require(['./views/dataSource/editDataSource.vue'], resolve)
    },
    {
        path: '/data_source_view/:id',
        component: (resolve) => require(['./views/dataSource/viewDataSource.vue'], resolve)
    },
    {
        path: '/query_statement_list',
        component: (resolve) => require(['./views/queryStatement/listQueryStatement.vue'], resolve)
    },
    {
        path: '/query_statement_edit/:id',
        component: (resolve) => require(['./views/queryStatement/editQueryStatement.vue'], resolve)
    },
    {
        path: '/query_statement_view/:id',
        component: (resolve) => require(['./views/queryStatement/viewQueryStatement.vue'], resolve)
    },
    {
        path: '/step_config_data_source',
        component: (resolve) => require(['./views/queryStatement/stepConfigDataSource.vue'], resolve)
    },
    {
        path: '/step_config_table',
        component: (resolve) => require(['./views/queryStatement/stepConfigTable.vue'], resolve)
    },
    {
        path: '/step_config_query_statement',
        component: (resolve) => require(['./views/queryStatement/stepConfigQueryStatement.vue'], resolve)
    },
    {
        path: '/list_query_view',
        component: (resolve) => require(['./views/queryView/listQueryView.vue'], resolve)
    },
    {
        path: '/customize_list_query_view',
        component: (resolve) => require(['./views/queryView/customizeListQueryView.vue'], resolve)
    },
    {
        path: '/list_data_source_and_query_statement',
        component: (resolve) => require(['./views/queryView/listDataSourceAndQueryStatement.vue'], resolve)
    }
];
export default routers;