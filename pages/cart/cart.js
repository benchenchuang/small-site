// pages/cart/cart.js
const app = getApp()
const api = require('../../utils/api.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    delBtnWidth: 300,//删除按钮宽度单位（rpx）
    total: 0,
    Allselected: '',
    allNumber: 0,
    selected: [],
    list: []
  },
  //结算
  submit: function (e) {
    var items = [];
    this.data.list.forEach(item => {
      if (item.Checked == "Checked") {
        items.push({
          GoodsId: item.GoodsId,
          Quantity: item.Quantity
        });
      }
    });
    if (items.length > 0) {
      wx.showLoading({ title: '正在生成订单', mask: true });
      api.buy({ BuyType: 1, Items: items }, res => {
        wx.hideLoading()
        if (res > 0) {
          wx.navigateTo({ url: '../confirm_order/confirm_order?id=' + res });
        }
      });
    } else {
      wx.showModal({
        title: '结算警告',
        content: '请至少选中一个商品!',
      });
    }
  },
  //计算有多少选择的商品
  getAll: function () {
    var allNum = 0;
    var tmpList = this.data.list;
    tmpList.forEach(item => {
      if (item.Checked) {
        allNum += item.Quantity;
      }
    })
    this.setData({
      allNumber: allNum
    })

  },
  //选择是否结算的
  select: function (e) {
    var self = this;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var tmpList = this.data.list;
    var tmp = this.data.selected;
    var goods = tmpList[index];
    if (tmp.indexOf(id) < 0) {
      tmp.push(id);
      goods.Checked = "Checked";
    } else {
      var tmp_new = [];
      tmp.forEach(item => {
        if (item != id) {
          tmp_new.push(item);
        }
      });
      goods.Checked = '';
      tmp = tmp_new;
    }
    this.isAll();
    this.setData({ list: tmpList, selected: tmp });
    this.calcCart();
  },
  //判断是否全选了
  isAll: function () {
    var self = this;
    var tmpList = this.data.list;
    var selecteTmp = [];
    tmpList.forEach(item => {
      if (!item.Checked) {
        selecteTmp.push(item);
      };
    });

    if (selecteTmp.length > 0) {
      self.setData({
        Allselected: ""
      });
    } else {
      self.setData({
        Allselected: 'Checked'
      });
    }
  },
  checkboxgroupBindchange: function (e) {
    var temp1 = e.detail.value
    var temp2 = ''
    // console.log(temp1)
    if (temp1.length != 0) {
      for (var i = 0, len = temp1.length; i < len; i++) {
        temp2 = temp2 + temp1[i] + ','
      }
      this.setData({
        text: '您选择了：' + temp2
      })
    } else {
      this.setData({
        text: ''
      })
    }
  },
  //点击全选
  selectAll: function (e) {
    var tmp = [];
    var tmpList = [];
    if (e.detail.value == "all") {
      this.data.list.forEach(item => {
        tmp.push(item.Id);
        item.Checked = "Checked";
        tmpList.push(item);
      });
    } else {
      this.data.list.forEach(item => {
        item.Checked = "";
        tmpList.push(item);
      });
    }
    this.setData({ list: tmpList, selected: tmp });
    this.calcCart();
  },
  //数量增加
  plus: function (e) {
    var index = e.currentTarget.dataset.index;
    var item = this.data.list[index];
    if (item.Quantity < 99) {
      api.addToCart({ GoodsId: item.GoodsId, Quantity: 1 }, res => {
        var tmpList = this.data.list;
        tmpList[index].Quantity = item.Quantity + 1;
        this.setData({ list: tmpList });
        this.calcCart();
      });
    }
  },
  //数量减少
  minus: function (e) {
    var index = e.currentTarget.dataset.index;
    var item = this.data.list[index];
    if (item.Quantity == 1) {
      var that = this;
      wx.showModal({
        title: '提示',
        content: '是否从购物车删除商品？', success: function (res) {
          if (res.confirm) {
            api.addToCart({ GoodsId: item.GoodsId, Quantity: -1 }, res => {
              var tmpList = that.data.list;
              tmpList[index].Quantity = item.Quantity - 1;
              if (tmpList[index].Quantity < 1) {
                tmpList.splice(index, 1);
              }
              that.setData({ list: tmpList });
              that.calcCart();
            });
          }
        }
      })
    } else {
      api.addToCart({ GoodsId: item.GoodsId, Quantity: -1 }, res => {
        var tmpList = this.data.list;
        tmpList[index].Quantity = item.Quantity - 1;
        if (tmpList[index].Quantity < 1) {
          tmpList.splice(index, 1);
        }
        this.setData({ list: tmpList });
        this.calcCart();
      });
    }

  },
  //计算选中的商品的总价
  calcCart() {
    var mTotal = 0;
    this.data.list.forEach(function (element) {
      if (element.Checked == "Checked") {
        mTotal += element.Price * element.Quantity;
      }
    });
    this.setData({ total: mTotal.toFixed(2) });
    this.getAll();
  },
  //点击删除按钮事件  
  delItem: function (e) {
    this.showModel(e, '是否从购物车删除商品？');
  },
  //删除提示
  showModel: function (e, message) {
    var self = this;
    wx.showModal({
      title: '提示',
      content: message,
      success: function (res) {
        if (res.confirm) {


          //获取列表中要删除项的下标  
          var index = e.target.dataset.index;
          var list = self.data.list;
          var cart = list[index];
          api.deleteShoppingCartItem({ Id: cart.Id }, res => {
            //移除列表中下标为index的项
            list.splice(index, 1);
            //更新列表的状态
            self.setData({ list: list });

            self.calcCart()
            self.getAll();
          });
        }
      }
    })
  },
  loadData() {
    api.getMyShoppingCart({}, res => {

      res.forEach(function (element) { element.Checked = ""; element.txtStyle = ""; });

      this.setData({ list: res, selected: [], total: 0, });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadData();

    // 页面初始化 options为页面跳转所带来的参数  
    this.initEleWidth();
    this.calcCart();
    this.getAll();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

    wx.stopPullDownRefresh();
    this.loadData();
    this.calcCart();
    this.getAll();
    this.setData({
      total: 0,
      Allselected: '',
      allNumber: 0,
      selected: [],
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {

      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "rpx";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "rpx";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;

      var list = this.data.list;
      if (index != undefined) {

        list.forEach(function (item, i) {
          if (index == i) {
            list[i].txtStyle = txtStyle;
          } else {
            list[i].txtStyle = "left:0px";
          }
        })
        //更新列表的状态
        this.setData({ list: list });
      }
    }
  },

  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "rpx" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      // console.log(e);
      if (index != undefined) {
        list[index].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
          list: list
        });
      }
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },

})