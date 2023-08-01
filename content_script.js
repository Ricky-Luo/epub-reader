var reg = /^http(s)?:\/\/(.*?)\//
var windowHref = reg.exec(window.location.href)[0];

var start = function () {
    // 判断是否在书签中

    // 判断是否在常用推荐中

    let links = document.getElementsByTagName('link');
    let size = links.length;
    let imgHref = ''
    for (let i = 0; i < size; i++) {
        let rel = links[i].getAttribute('rel');
        if (rel === 'apple-touch-icon-precomposed' || rel === 'shortcut icon' || rel === 'icon') {
            imgHref = links[i].getAttribute('href');
            break;
        }
    }
    
    // 创建img图片标签跨域
    var element = document.createElement('img');
    element.src = imgHref;
    element.style.display = 'none';
    element.onload = function name(res) {
      // 使用canvas转换为data64字符串储存在storage中。
      var canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(this, 0, 0, this.width, this.height);
      var dataURL = canvas.toDataURL("image/x-icon");  // 可选其他值 image/jpeg
      // 如果网址是书签，根据id保存。
      chrome.storage.local.get(windowHref, (result) => {
        var id = result[windowHref];
        if (id) { // 判定为数字，就是书签
          chrome.storage.local.set({[id]: dataURL},() => {
            console.log('成功写入');
          });
        }
      });

      // 如果网址是”经常”，根据url保存。
      chrome.storage.local.get(window.location.href, (result) => {
        var url = result[window.location.href];
        if (url) {
          chrome.storage.local.set({[window.location.href]: dataURL},() => {
            console.log('成功写入');
          });
        }
      });
     
    };
    document.body.appendChild(element);
}

// start();