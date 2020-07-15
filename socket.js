;(function (root, factory) {
    // 判断是否是AMD/CMD
    if (typeof define === 'function') {
        define([], factory)
    } else if (typeof exports === 'object') {
        // Node CommonJS规范
        module.exports = factory()
    } else {
        // 浏览器环境
        root.CreateSocket = factory()
    }
})(this, function () {

    /**
     * 事件处理
     */
    class Events {
        constructor() {
            this.events = new Map();
        }

        /**
         * 事件监听
         * @param key
         * @param fn
         */
        on(key, fn) {
            if (typeof fn !== "function") {
                return
            }
            if (this.events.has(key)) {
                this.events.set(key, [...this.events.get(key), fn])
            } else {
                this.events.set(key, [fn])
            }
        }

        /**
         * 事件触发
         * @param key
         * @param arg
         */
        emit(key, ...arg) {
            if (!this.events.has(key)) {
                return
            }
            this.events.get(key).forEach(fn => {
                fn(...arg);
            })
        }
    }

    /**
     * 创建socket
     */
    class CreateSocket {
        constructor(url, options) {
            const defaultOption = {
                reconnect: true,
                reconnectTime: 2000
            };
            this.reconnectStatus = false; // 重新连接状态
            this.reconnectTimer = null; // 重新连接的定时器
            this.url = url; // 连接的地址
            this.options = Object.assign({}, defaultOption, options);
            this.events = new Events();
            this._createSocket();
        }

        /**
         * 初始化socket监听
         * @private
         */
        _init() {
            // 监听接收消息
            this.socket.onmessage = (event) => {
                this.events.emit("message", event);
                let { data } = event;
                try {
                    data = JSON.parse(data);
                }catch (e) {
                }
                Object.keys(data).forEach(type => {
                    this.events.emit(type, data[type])
                })
            };

            // 监听连接成功
            this.socket.onopen = (event) => {
                this.reconnectTimer && clearInterval(this.reconnectTimer);
                this.reconnectStatus = false;
                this.events.emit("open", event);
            };

            // 监听关闭
            this.socket.onclose = (event) => {
                this.events.emit("close", event);
                if (this.options.reconnect) {
                    this.reconnect();
                }
            };

            // 监听错误
            this.socket.onerror = (event) => {
                this.events.emit("error", event);
            };
        }

        /**
         * 创建socket连接
         * @returns {WebSocket}
         * @private
         */
        _createSocket() {
            this.socket = new WebSocket(this.url);
            this._init();
        }

        /**
         * 重新连接
         */
        reconnect() {
            if (this.reconnectStatus) {
                return
            }
            this.reconnectStatus = true;
            this.reconnectTimer ? clearInterval(this.reconnectTimer) : this._createSocket();
            this.reconnectTimer = setInterval(() => {
                this._createSocket();
            }, this.options.reconnectTime)
        }

        /**
         * 监听消息类型
         * @param type
         * @param fn
         */
        on(type, fn) {
            if (typeof fn !== "function") {
                return
            }
            this.events.on(type, fn);
        }

        /**
         * 发送消息
         * @param type
         * @param data
         */
        emit(type, data) {
            let msg = JSON.stringify({
                [type]: data
            });
            this.socket.send(msg);
        }

        /**
         * 获取socket连接对象
         * @returns {WebSocket}
         */
        getSocket() {
            return this.socket
        }
    }

    return CreateSocket
});
