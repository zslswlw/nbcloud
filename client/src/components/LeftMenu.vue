<template>
    <el-row class="menu_page">
         <el-col>
             <el-menu
                mode="vertical"
                background-color="#324057"
                text-color="#fff"
                active-text-color="#409eff" 
                class="el-menu-vertical-demo">
                <!-- <router-link to="/home">
                    <el-menu-item index="0">
                        <i class="fa fa-margin fa-server"></i>
                        <span slot="title">首页</span>
                    </el-menu-item>
                </router-link> -->
                <template  v-for="item in items" >
                    <el-submenu v-if="item.children" :index="item.path" :key="item.path">
                        <template slot="title">
                            <i :class="'fa fa-margin '+item.icon"></i>
                            <span slot="title">{{item.name}}</span>
                        </template>
                        <router-link v-for="(citem,cindex) in item.children" 
                            :to="citem.path" :key="cindex">
                            <el-menu-item 
                                :index='citem.path'>
                                <span slot="title">{{citem.name}}</span>
                            </el-menu-item> 
                        </router-link>
                    </el-submenu>                   
                </template>
             </el-menu>
         </el-col>
    </el-row>
</template>
<script>
export default {
  name: "leftmenu",
  data() {
    return {
      items: [
        {
          icon: "fa-bar-chart",
          name: "后台管理",
          path: "mainControl",
          children: [{ path: "mainControl", name: "后台主控" }]
        },
        {
          icon: "fa-microchip",
          name: "设备管理",
          path: "deviceList",
          children: [
            { path: "devicelist", name: "设备列表" },
            { path: "createdevice", name: "创建设备" },
            { path: "infoshow", name: "历史信息" }
            ]
        },
        {
          icon: "fa-edit",
          name: "应用编辑",
          path: "edit",
          children: [
            { path: "infoshow", name: "我的项目" },
            { path: "infoshow", name: "共享项目" }
          ],
        },
        {
          icon: "fa-user-circle-o",
          name: "用户信息",
          path: "userinfo",
          children: [{ path: "infoshow", name: "修改信息" }],
        },
      ]
    };
  }
};
</script>
<style scoped>
.menu_page {
  position: fixed;
  top: 71px;
  left: 0;
  min-height: 100%;
  background-color: #324057;
  z-index: 99;
}
.el-menu {
  border: none;
}
.fa-margin {
  margin-right: 5px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  min-height: 400px;
}
.el-menu-vertical-demo {
  width: 35px;
}
.el-submenu .el-menu-item {
  min-width: 180px;
}

.hiddenDropdown,
.hiddenDropname {
  display: none;
}
a {
  text-decoration: none;
}
</style>
