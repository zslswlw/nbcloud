const WebSocket = require('ws');


module.exports = {
    // 保证整个项目只有一个socket实例
    ws: null, // Websocket实例
    init(config, onMessage, onError) {
      if (!this.ws) {
        //console.log(config.user._id);
        // 实例化socket对象
        this.ws = new WebSocket(`ws://localhost:3200/${config.user._id}`);
      }
  
      // 客户端接收消息
      this.ws.onmessage = event => {
        let message = JSON.parse(event.data);
        onMessage && onMessage(message); // 接收到消息触发的回调
      };
  
      // 出错
      this.ws.onerror = error => {
        onError && onError(error);
      };
  
      this.ws.onclose = () => {
        this.ws = null;
      };
    },
    send(msgObj) {
      // 发送消息的时候触发
      this.ws.send(JSON.stringify(msgObj));
    }
  };
  