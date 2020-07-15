#   对WebSocket进行的分装

*   使用：
    
    *   引入js
    
        ```html
        <script src="socket.js"></script>
        ```
    
    *   创建连接
    
        ```javascript
        let socket = new CreateSocket("ws://localhost:3001/socketTest");
        ```
    
    *   监听事件
    
        ```javascript
        // 监听连接
        socket.on("open", function (event) {
            console.log("连接成功", event);
        });
    
        // 监听关闭
        socket.on("close", function (event) {
            console.log("连接关闭", event);
        });
    
        // 监听错误
        socket.on("error", function (event) {
            console.log("socket出现错误", event);
        });
        ```
        
    *   监听消息（两种方式）
            
        *   监听message事件
        
            ```javascript
            socket.on("message", function (event) {
                console.log("socket接收到消息", event);
            });
            ```
        
        *   监听具体消息  
            
            ```javascript
            // 后端发送的消息格式是JSON字符串
            // 例：{char: "服务端发送的聊天信息"}
            socket.on("char", function(data) {
                console.log("接收到服务器返回的char类型的消息：" + data);
                // 接收到服务器返回的char类型的消息：服务端发送的聊天信息
            })
            ```
    *   发送消息
    
        ```javascript
        socket.emit("msg", "客户端发送的数据_msg");
        // 后端接收到的消息是JSON格式
        // {msg: "客户端发送的数据_msg"}
        ```
        
*   Api

    *   new
    
        创建`CreateSocket`对象  
        
        *   参数：
            
            *   url
            
                webSocket地址
                
            *   options  
            
            | 字段名称 | 类型 | 默认值 | 描述 |
            | ------- | ---- | ----- | ---- |
            | reconnect | `Boolean` | true | 是否在来连接中断后重新连接 |
            | reconnectTime | `Number` | 2000 | 重新连接间隔时间 |
        
        例：
        ```javascript
        let socket = new CreateSocket("ws://localhost:3001/socketTest");   
        ```

    *   on
        
        监听事件  
        例：
        ```javascript
        socket.on("message", function (event) {
            console.log("socket接收到消息", event);
        });
        ```
        
    *   emit
    
        发送消息  
        例：
        ```javascript
        socket.emit("msg", "客户端发送的数据_msg");
        ```
        
    *   getSocket
    
        获取socket对象，返回`WebSocket`对象  
        例：
        ```javascript
        let webSocket = socket.getSocket();
        ```
        
    *   reconnect
    
        重新连接socket
        
*   内置事件类型  
    
    | 时间名称 | 描述 | 参数
    | --- | --- | --- |
    | message | 接收到服务端发送的消息触发事件 | `Event` |
    | open | 连接成功触发事件 | `Event` |
    | close | 连接关闭触发事件 | `Event` |
    | error | 发生错误触发事件 | `Event` |
 
