(function(window, document) {
  function HU() {
    // if (!(this instanceof HU) return new HU(opt);

    // if (!(opt instanceof Object) return;
    // if ((typeof opt.pullRefresh) !== 'object') return;
    // console.log(opt.pullRefresh);
    // this.pullRefresh = new PullRefresh(opt.pullRefresh);
    
    
  };

  HU.prototype = {
    init: function(opt) {
      this.pullRefresh = new PullRefresh(opt.pullRefresh);
    }
  };

  function PullRefresh(obj) {
    this.el = obj.el,
    this.header = obj.header,
    this.footer = this.extend({
      node: null,
      isLoading: false
    },obj.footer),
    this.init();
  }
  PullRefresh.prototype = {
    init: function() {
      if (this.el.indexOf("#") == -1) {
        return ;
      }
      var container = document.getElementById(this.el.substring(1));
      if (this.footer.node) {
        return;
      }
      
      var newnode = document.createElement("div");
      newnode.style.cssText = "width:100%;height:40px;color:#999;display:flex;display:-webkit-flex;justify-content:center;align-items:center;background:red;";
      var loadingImg = document.createElement("div");
      loadingImg.className = 'loading-img';
      newnode.appendChild(loadingImg);
      var spanNode = document.createElement("span");
      spanNode.style.lineHeight = '40px';
      spanNode.innerHTML = '加载中';
      newnode.append(spanNode);
      this.footer.node = newnode;
      this.container = container;
    },
    startLoading: function() {
      this.container && this.container.append(this.footer.node);
      this.footer.isLoading = true;
      this.footer.callback && this.footer.callback();
    },
    endLoading: function() {
      if (this.footer.isLoading) {
        this.container.removeChild(this.footer.node);
        this.footer.isLoading = false;
      }
    },
    nomoreData: function() {
      console.log('nomoreData');
      if (!this.footer.isLoading) return

      var imgNode = this.footer.node.childNodes[0];
      var spanNode = this.footer.node.childNodes[1];
      if (imgNode && spanNode) {
        imgNode.style.display = 'none';
        spanNode.innerHTML = '没有更多数据了';
      }
    },
    extend: function(obj, obj2) {
      for (var key in obj2) {
        obj[key] = obj2[key];
      }
      return obj;
    }
  }

  window.hu = new HU();
 
}(window, document));


//获取滚动条当前的位置 
function getScrollTop () {
  var scrollTop = 0
  if (document.documentElement && document.documentElement.scrollTop) {
    scrollTop = document.documentElement.scrollTop;
  } else if (document.body) {
    scrollTop = document.body.scrollTop;
  }
 
  return scrollTop;
}

//获取当前可是范围的高度 
function getClientHeight() { 
  var clientHeight = 0; 
  if (document.body.clientHeight && document.documentElement.clientHeight) { 
    clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight); 
  } 
  else { 
    clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight); 
  } 
  
  return clientHeight; 
} 

//获取文档完整的高度 
function getScrollHeight () { 
  return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
} 

window.onscroll = function () {
  console.log('window.onscroll'); 
  if (getScrollTop() + getClientHeight() == getScrollHeight()) { 
    if (!hu.pullRefresh.footer.isLoading) {
      console.log('scorll to bottom');
      hu.pullRefresh.startLoading();
    }
  } 
}
