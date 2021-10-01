
var variables = new Object();
var count = 0;
var starting = false;
class VirtualRobot {

  constructor() {}

  getInfo() { 
    return {
      id: 'VirtualRobot',
      name: 'VirtualRobot',
      blocks: [
        {
          opcode: 'connect',
          blockType: Scratch.BlockType.COMMAND,
          text: '接続:ws://[URL]:[PORT]/',
          arguments: {
            URL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "localhost"
            },
            PORT: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: "3000"
            }
          }
        },
        {
          opcode: 'disconnect', 
          blockType: Scratch.BlockType.COMMAND,　
          text: '切断',

        },
        {
          opcode: 'VRstart', 
          blockType: Scratch.BlockType.HAT,　
          text: 'スタートしたとき(開発中)',
          arguments: {
            mode: {
              type: Scratch.ArgumentType.BOOLEAN,
              defaultValue: "false"
            }
          }
        },
        {
          opcode: 'set', 
          blockType: Scratch.BlockType.COMMAND,　
          text: '[KEY]=[VALUE]',
          arguments: {
            KEY: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "A.power"
            },
            VALUE: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: "0"
            }
          }
        },
        {
          opcode: 'get', 
          blockType: Scratch.BlockType.REPORTER,　
          text: 'get[KEY]',
          arguments: {
            KEY: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "mode"
            }
          }
        }
      ]
    };
  }

  connect(args) {
     
      const URL = "ws://" + args.URL + ":" + args.PORT + "/";
    console.log("Will connect to " + URL);
     

  this.connection = new WebSocket(URL);

        // 接続通知
        this.connection.onopen = (event) => {
            console.log( "通信接続イベント受信");
         
        };

        //エラー発生
        this.connection.onerror = (error) => {
            console.log( "エラー発生イベント受信");
    
        };

        //メッセージ受信
        this.connection.onmessage = (event) => {
            // console.log("Received a message [" + event.data + "]");

          console.log("メッセージ受信" + event.data);
          // messagebox = event.data;
          variables[event.data.split('=')[0]] = event.data.split('=')[1];
           console.log(event.data.split('=')[0]+"が"+variables[event.data.split('=')[0]]+"になった");
          if (event.data=="mode=-1") {
            console.log("動作モードに");
            starting = true;
         }
        };

        //切断
        this.connection.onclose = () => {
            console.log( "通信切断イベント受信");
            
        };


 
  }
  disconnect(args) {
    this.connection.close();
  }

  set(args) {
    console.log("set:"+args.KEY +":"+ args.VALUE);
    this.connection.send("set:"+args.KEY +":"+ args.VALUE);
  }
  get(args) {
  
      return variables[args.KEY];
 
  }
  
  VRstart(args) {
    // console.log("startで使うmodeは" + (variables["mode"] == args.mode));
    // console.log((Math.random() * 100 < 50 ? true : false));
    //  return variables["mode"]==args.mode;

  //  var tmp = false;
  //   if (lastmode != variables["mode"]) {
  //     console.log("モード変更");
  //     tmp = true;
  //   }
  //   lastmode = variables["mode"];
  //   console.log("スタート"+tmp);
  //   return tmp;
    var rtn = starting;
    starting = false;
    console.log(rtn);
    return rtn;
   
  }
 

 
}
// Scratch.module.exports = Test;
Scratch.extensions.register(new VirtualRobot());



/*メモ
ローカルで実行
Set-ExecutionPolicy RemoteSigned -Scope Process;http-server

最初につけるScratch内臓だとconst ArgumentType = require('../../extension-support/argument-type');らしい
*/