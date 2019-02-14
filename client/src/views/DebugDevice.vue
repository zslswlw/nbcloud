<template>

  <el-row :gutter="2" class="mainRow">
    <el-col :span="20">
      <div class="maincontaint">
        <el-container direction="vertical" class="decontainer">

          <el-row class="navbar">
            <el-header>
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }" replace>首页</el-breadcrumb-item>
                <el-breadcrumb-item >设备管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/debugDevice'}" replace>数据传输</el-breadcrumb-item>
              </el-breadcrumb>
            </el-header>

            <el-main class="debugmain">
              <el-row class="debugrow">

                <el-form label-width="100px" class="debugdevices" :inline="true">
                  <el-row>
                    <div class="panel-header">数据传输</div>
                  </el-row>
                  <el-row class="devicebody">
                    <el-col :span="24">
                      <!--<el-input readonly type="textarea" :rows="18" id="messages-window" v-for="(message, idx) in messages"  :key="idx"-->
                                <!--v-bind:class="'message ' + (message.txrx == 'T' ? 'ours' : 'theirs')">-->
                                <!--{{message.content}}-->
                                <!--&lt;!&ndash;v-model="TxRxUdpData.downTip + TxRxUdpData.ReceUdpData + TxRxUdpData.upTip + TxRxUdpData.TransUdpData">&ndash;&gt;-->
                      <!--</el-input>-->
                      <!--<scroll :data="messages" class="seamless-warp">-->
                      <div id="chat">
                        <div id="messages-window" class="content_wrap" 
                            v-for = "(item, index) in messageList"
                            :key = "index"
                            >
                            <!-- 设备的内容 -->
                            <div class="left_msg" v-if = "item.source == 'other'">
                                <img :src="targetUser.avatar" alt="">
                                <span>{{item.msg}}</span>
                            </div>
                            <!-- 我的内容 -->
                            <div class="right_msg" v-if="item.source == 'self'">  
                                <span>{{item.msg}}</span>
                                <img :src="user.avatar" alt="">
                            </div>
                          <!-- <span v-bind:class="'message ' + (message.txrx == 'T' ? 'ours' : 'theirs')" v-for="message in messages">{{message.content}}</span> -->

                        </div>
                      </div>

                      <!--</scroll>-->

                        <!--<ul class="item">-->
                          <!--<li v-for="item in listData">-->
                            <!--<span class="title" v-text="item.title"></span><span class="date" v-text="item.date"></span>-->
                          <!--</li>-->
                        <!--</ul>-->

                    </el-col>
                  </el-row>

                  <el-row class="devicebody" :gutter="30">
                    <el-col :span="20">
                      <el-input v-model="txData" placeholder="请输入需要发送的数据" @keyup.enter.native="transDataToDevice"></el-input>
                      <!--<input type="text" v-model="newMessageContent" v-on:keyup.enter="addMessage"/>-->
                    </el-col>
                    <el-col :span="4">
                      <el-button @click="sendMessage">发送</el-button>
                    </el-col>
                  </el-row>

                  <el-row :gutter="30">
                    <el-col :span="4" :offset="1">
                      <el-checkbox label="按16进制发送"></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                      <el-checkbox label="加回车换行符"></el-checkbox>
                    </el-col>
                    <el-col :span="6">
                    </el-col>
                  </el-row>

                </el-form>

              </el-row>
            </el-main>

          </el-row>
        </el-container>
      </div>
    </el-col>
    <!--<el-button @click="test" type="text" size="small">test</el-button>-->
    <el-col :span="4">
      <el-row>
        <el-card class="box-card" shadow="hover">
          <div class="clearfix" slot="header">
            <span>设备信息</span>
          </div>
          <div class="text item">
            <el-row>
              <label>设备ID:</label>
              <label>{{ deInfo.deviceID }}</label>
            </el-row>
            <el-row>
              <label>设备密码:</label>
              <label>{{ deInfo.devicePwd }}</label>
            </el-row>
            <el-row>
              <label>设备名称:</label>
              <label>{{ deInfo.deviceName }}</label>
            </el-row>
            <el-row>
              <label>设备地址:</label>
              <label>{{ deInfo.deviceAddr }}</label>
            </el-row>
            <el-row>
              <label>设备描述:</label>
              <label>{{ deInfo.deviceDetail }}</label>
            </el-row>
          </div>
        </el-card>
      </el-row>
      <el-row>
        <el-card class="box-card" shadow="hover">
          <div class="clearfix" slot="header">
            <span>其他信息</span>
          </div>
          <div class="text item">
            <el-row>
              <label>注册包:</label>
              <label>ID={{ deInfo.deviceID }}&pwd={{ deInfo.devicePwd }}</label>
            </el-row>
            <el-row>
              <label>单片机需要发送的注册包:</label>
              <label>预留</label>
            </el-row>
          </div>
        </el-card>
        <!--<el-button @click="clickButton">发送</el-button>-->
      </el-row>
    </el-col>
  </el-row>
</template>


<script>
//   import Vue from 'vue'
//   import Bus from './../API/bus'
//   import './../assets/css/debugDevice.css'
//   import axios from 'axios'
//   import VueSocketio from 'vue-socket.io';
//   import socketio from 'socket.io-client';
//   import scroll from 'vue-seamless-scroll'
    import Wsocket from "../socket.js"
//   // Vue.use(VueSocketio, socketio('http://127.0.0.1:3200'));
//   Vue.use(VueSocketio, socketio('http://193.112.57.70:3200'))
    export default {
      name: "debug-device",
      data() {
        return {
          deInfo: {
            deviceID: '',
            devicePwd: '',
            deviceName: '',
            deviceAddr: '',
            deviceDetail: '',
            deviceStatus: ''
          },
          status: '',
          TxRxUdpData: {
            downTip: "云平台<--终端(上行数据):  ",
            ReceUdpData: '',
            upTip: "云平台-->终端(下行数据):  ",
            TransUdpData: ''
          },
          txData: '',
          messages: [],
          messageList: []
        }
      },
      components: {
        //scroll
      },
      beforeRouteEnter (to, from, next) {
        next(vm => {
          vm.deInfo = to.params.deInfo;
          vm.getMessage();
        })
      },
      methods: {
        saveMsg() {// 保存消息
         //console.log(deInfo);
          let message = {
            target: {
              //avatar: this.targetUser.avatar,
              name: this.deInfo.deviceName,
              _id: this.deInfo._id
            },
            count: 0,
            message: this.messageList,
            user_id: this.user.id
          };
          console.log(message);
          this.$axios
            .post("/api/msgprofiles/add", message)
            .then(res => (this.msgValue = ""));
        },
      
      getMessage(){
        this.$axios(`/api/msgprofiles/msg/${this.user.id}`)
        //this.$axios('/api/msgprofiles/msg/5c6198c81070512d40b0857f')
          .then(res => {
            let result = res.data.filter(data => {
              return data.target._id == this.deInfo._id;
            });
            if(result.length > 0){
                this.messageList = result[0].message;
            }
          })
      },

      sendMessage(){
        const msgObj = {
          target: this.deInfo._id,
          current: this.user.id,
          msg: this.txData,
        };
        Wsocket.send(msgObj);

        //本地客户端显示
        this.messageList.push({
          msg: this.txData,
          source: "self"
        });

        this.saveMsg();
      }

      //   transDataToDevice(val){
      //     // this.messages.push({txrx: 'T', content: this.TxRxUdpData.TransUdpData});


      //     this.$socket.emit('TxData', this.txData);//触发TxData
      //   }
      // },
      // sockets:{
      //   connect(){
      //     console.log('socket connected')
      //   },
      //   ReceUdpData(val) {
      //     console.log(val);
      //     this.TxRxUdpData.ReceUdpData = val.receUdpData;
      //     this.status = "3";
      //     // this.TxRxUdpData.ReceUdpData = this.TxRxUdpData.ReceUdpData  + val.receUdpData + "\r\n";
      //     this.messages.push({txrx: 'R', content: this.TxRxUdpData.ReceUdpData});
      //     localStorage.setItem('receUdpData',JSON.stringify(val));
      //     console.log(document.getElementById('chat').scrollHeight);
      //     document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
      //   },
      //   TransUdpData(val) {
      //     console.log(val);
      //     this.TxRxUdpData.TransUdpData = val.transUdpData;
      //     // this.TxRxUdpData.TransUdpData = this.TxRxUdpData.TransUdpData + val.transUdpData + "\r\n";
      //     this.messages.push({txrx: 'T', content: this.TxRxUdpData.TransUdpData});
      //     this.txData = '';
      //     localStorage.setItem('transUdpData',JSON.stringify(val));
      //     document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight -100;
      //   }
      },
      created() {
        // this.TxRxUdpData.ReceUdpData = "云平台<--终端:  testupData\r\n";
        // this.TxRxUdpData.TransUdpData = "云平台-->终端:  testdownData \r\n";
        // var self = this;
        // Bus.$on('getDeviceInfo', (row) => {
        //   // console.log(row);
        //   this.$nextTick( () => {
        //     // console.log(row);
        //     //self.deInfo = row;
        //     //   global.DEVINFO = row;
        //       this.deInfo = row;
        //       // global.DEVINFO = this.deInfo;
        //       // console.log(this.deInfo);

        //       // console.log(this.deInfo.deviceID + ' ' + this.deInfo.devicePwd);
        //       axios.post("/debugDevice/deviceInfo?deviceID=" + this.deInfo.deviceID + "&devicePwd=" + this.deInfo.devicePwd).then((response) => {
        //         // axios.post("/debugDevice?deviceID=" + this.deInfo.deviceID + "&devicePwd=" + this.deInfo.devicePwd).then((response) => {
        //         this.status = response.data.status;
        //         console.log(response.data.status);
        //         if (this.status == "1") {
        //           this.$notify({
        //             title: '成功',
        //             // message: '设备' + this.deInfo.deviceID + '已上线',
        //             message: 'UDP设备' + '已上线',
        //             type: 'success'
        //           });
        //         } else if (this.status == "2") {
        //           this.$notify({
        //             title: '成功',
        //             // message: '设备' + this.deInfo.deviceID + '已上线',
        //             message: 'CoAP设备' + '已上线',
        //             type: 'success'
        //           });
        //         } else if (this.status == "0"){
        //           this.$notify({
        //             title: '失败',
        //             message: '注册包错误',
        //             type: 'error'
        //           });
        //         } else if (this.status == "3"){
        //           this.$notify({
        //             title: '消息',
        //             message: '收到的消息:' + response.data.receData,
        //             type: 'info'
        //           });
        //         }
        //         console.log(response.data);
        //       })
        //   });
        // });
        // this.deInfo = global.DEVINFO;
        // console.log(this.deInfo.deviceID + ' ' + this.deInfo.devicePwd);
        // console.log(this.deInfo);/deviceID=" + this.deInfo.deviceID + "&devicePwd=" + this.deInfo.devicePwd

      },
      // beforeDestroy () {
      //   Bus.$off('getDeviceInfo', this.deInfo);
      // },
    mounted() {
        // this.TxRxUdpData.ReceUdpData = JSON.parse(localStorage.receUdpData);
        // this.TxRxUdpData.TransUdpData = JSON.parse(localStorage.transUdpData);
        Wsocket.init(
          { user: this.user },
          message => {
            // 收到消息后,将消息存储到数据中
            this.messageList.push({
              msg: message.msg,
              source: "other"
            });
            // 保存消息
            this.saveMsg();
          },
          error => {
            console.log(error);
          }
        );
    },
    computed: {
        user(){
            return this.$store.getters.user;
        }
    }
}
</script>

<style scoped>
.debugdevices {
  width: 900px;
  height: 600px;
  /*margin: 20px auto;*/
  background: #fff;
  box-shadow: 0 0 12px #5269c2;
  padding: 20px 20px 0 20px;
  border-radius: 3px;
}

.panel-header {
  border-bottom: 1px solid transparent;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding: 10px 15px;
  color: #333;
  background-color: #bfdcf5;
  border-color: #ddd;
}


.debugrow {
  margin-bottom: 20px;
  margin-left: 20px;
  width: 800px;
/*height: 1200px;*/
&:last-child {
   margin-bottom: 0;
 }
}



.complebtn {
  /*margin-left: 20px;*/
  margin-right: 0px;
  margin-left: 50px;
  margin-top: 30px;
}

.navbar {
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 20px;
  height: 20px;
&:last-child {
   margin-bottom: 0;
 }
}


.decontainer {
  height: 800px;
  width: 1100px;
  border: 1px solid #eee;
}

.maincontent {
  overflow: auto;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 400px;
}


.mainRow {
  width: 1400px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}


/*html, body {*/
  /*height:100%;*/
  /*font-family: 'SF UI Text', 'San Francisco Text', Roboto, -apple-system, sans-serif;*/
/*}*/

#chat {
  height: 380px;
  /*overflow: hidden;*/
  display: flex;
  flex-flow: column;
  /*position:absolute;*/
  overflow:auto;
}

#messages-window {
  background:#eee;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: auto;
  align-items:flex-start;
  padding:20px;
}

.message {
  background:gray;
  color:white;
  padding:8px 12px;
  margin-bottom:8px;
  border-radius:16px;
  max-width:70%;
}

.ours {
  background:#0076FF;
  align-self:flex-end;
}

.left_msg {
  justify-content: flex-start;
}
.right_msg {
  justify-content: flex-end;
}
.left_msg,
.right_msg {
  width: 100%;
  display: flex;
  margin: 5px 0;
}
.content_wrap img {
  width: 3rem;
  height: 3rem;
}
.content_wrap span {
  display: inline-block;
  max-width: 65%;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin: 0 5px;
  padding: 8px;
  box-sizing: border-box;
  word-break: break-all;
}
.left_msg span {
  background-color: #fff;
}
.right_msg span {
  background-color: #0fce0d;
}

</style>
