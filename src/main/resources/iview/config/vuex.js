/**
 * Created by kevin on 2017/2/15.
 */
exports.DATA_SOURCE = {
    URL: {
        LIST: 'http://localhost:8989/default/datasource_page',
        ADD: 'http://localhost:8989/default/datasource_update',
        UPDATE: 'http://localhost:8989/default/datasource_update',
        REMOVE: 'http://localhost:8989/default/datasource_del_id',
        GET: 'http://localhost:8989/default/datasource_get_id'
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

