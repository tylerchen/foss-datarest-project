/**
 * Created by kevin on 2017/2/15.
 */
exports.PAGE = {
    INIT_CURRENT_PAGE: 1,
    INIT_PAGE_SIZE: 10
};
exports.DATA_SOURCE = {
    URL: {
        LIST: 'http://localhost:8989/default/datasource_page',
        ADD: 'http://localhost:8989/default/datasource_update',
        UPDATE: 'http://localhost:8989/default/datasource_update',
        REMOVE: 'http://localhost:8989/default/datasource_del_id',
        GET: 'http://localhost:8989/default/datasource_get_id'
    },
    ROUTER: {
        LIST: '/data_source_list',
        ADD: '/data_source_add',
        EDIT: '/data_source_edit',
        VIEW: '/data_source_view'
    }
};
exports.TABLE = {
    URL: {
        LIST: 'http://localhost:8989/default/table_find_id',
        GET: 'http://localhost:8989/default/table_get_id'
    }
};
exports.QUERY_STATEMENT = {
    URL: {
        LIST: 'http://localhost:8989/default/querystatement_page',
        ADD: 'http://localhost:8989/default/querystatement_update',
        UPDATE: 'http://localhost:8989/default/querystatement_update',
        REMOVE: 'http://localhost:8989/default/querystatement_del_id',
        GET: 'http://localhost:8989/default/querystatement_get_id'
    },
    ROUTER: {
        LIST: '/query_statement_list',
        ADD: '/query_statement_add',
        EDIT: '/query_statement_edit',
        VIEW: '/query_statement_view',
        STEP_CONFIG_DATA_SOURCE: '/step_config_data_source',
        STEP_CONFIG_TABLE: '/step_config_table',
        STEP_CONFIG_QUERY_STATEMENT: '/step_config_query_statement'
    }
};
exports.QUERY_STATEMENT_CREATE_STORE = {
    dataSourceId: '',
    tables: [],
    queryStatementModel: {
        name: '',
        description: '',
        primaryTable: {},
        joinTables: [],
        selectColumns: [],
        whereConditions: []
    },
    clear: function () {
        this.dataSourceId = '',
        this.tables = [],
        this.queryStatementModel = {
            name: '',
            description: '',
            primaryTable: {},
            joinTables: [],
            selectColumns: [],
            whereConditions: []
        }
    }
};
exports.SEPARATOR = {
    SPACE_SPLIT: ' ',
    DOT_SPLIT: '.',
    ON_SPLIT: ' ON ',
    EQ_SPLIT: ' = ',
    AND_SPLIT: ' AND ',
    UNDERLINE_SPLIT: '_',
    COLON_SPLIT: ':',
    POUND_SIGN_SPLIT: '#'
};

