/**
 * Created by aresn on 16/8/22.
 */
const routers = {
    '/index': {
        component (resolve) {
            require(['./views/index.vue'], resolve);
        }
    },
    '/data_source_list': {
        component (resolve) {
            require(['./views/dataSource/listDataSource.vue'], resolve);
        }
    },
    '/data_source_add': {
        component (resolve) {
            require(['./views/dataSource/addDataSource.vue'], resolve);
        }
    },
    '/data_source_edit/:id': {
        component (resolve) {
            require(['./views/dataSource/editDataSource.vue'], resolve);
        }
    },
    '/data_source_view/:id': {
        component (resolve) {
            require(['./views/dataSource/viewDataSource.vue'], resolve);
        }
    },
    '/query_statement_list': {
        component (resolve) {
            require(['./views/queryStatement/listQueryStatement.vue'], resolve);
        }
    },
    '/query_statement_edit/:id': {
        component (resolve) {
            require(['./views/queryStatement/editQueryStatement.vue'], resolve);
        }
    },
    '/query_statement_view/:id': {
        component (resolve) {
            require(['./views/queryStatement/viewQueryStatement.vue'], resolve);
        }
    },
    '/step_config_data_source': {
        component (resolve) {
            require(['./views/queryStatement/stepConfigDataSource.vue'], resolve);
        }
    },
    '/step_config_table': {
        component (resolve) {
            require(['./views/queryStatement/stepConfigTable.vue'], resolve);
        }
    },
    '/step_config_query_statement': {
        component (resolve) {
            require(['./views/queryStatement/stepConfigQueryStatement.vue'], resolve);
        }
    },
    '/list_query_view': {
        component (resolve) {
            require(['./views/queryView/listQueryView.vue'], resolve);
        }
    },
    '/customize_list_query_view': {
        component (resolve) {
            require(['./views/queryView/customizeListQueryView.vue'], resolve);
        }
    },
    '/list_data_source_and_query_statement': {
        component (resolve) {
            require(['./views/queryView/listDataSourceAndQueryStatement.vue'], resolve);
        }
    }
};
export default routers;