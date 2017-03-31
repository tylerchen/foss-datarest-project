<style scoped>
    @import '../styles/common.css';
</style>
<template>

    <div>
        <Menu mode="horizontal" :theme="theme1" active-key="1">
            <Menu-item key="1" v-link="{ path: '/index'}">
                <Icon type="ios-paper"></Icon>
                首页
            </Menu-item>
            <Menu-item key="2" v-link="{ path: '/data_source_list'}">
                <Icon type="ios-people"></Icon>
                数据源管理
            </Menu-item>
            <Menu-item key="3" v-link="{ path: '/query_statement_list'}">
                <Icon type="ios-people"></Icon>
                查询模板管理
            </Menu-item>
            <Submenu key="4">
                <template slot="title">
                    <Icon type="stats-bars"></Icon>
                    数据处理
                </template>
                <Menu-group title="使用">
                    <Menu-item key="3-1">新增和启动</Menu-item>
                    <Menu-item key="3-2">活跃分析</Menu-item>
                    <Menu-item key="3-3">时段分析</Menu-item>
                </Menu-group>
                <Menu-group title="留存">
                    <Menu-item key="3-4">用户留存</Menu-item>
                    <Menu-item key="3-5">流失用户</Menu-item>
                </Menu-group>
            </Submenu>
        </Menu>
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                theme1: 'light'
            }
        },
        ready () {

        },
        beforeDestroy () {

        },
        methods: {

        }
    }
</script>
