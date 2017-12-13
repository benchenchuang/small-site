// pages/orders/orders.js
var app = getApp();
const api = require('../../utils/api.js')
Page({
  data: {
    states: [],
    sId: 0,
    page: 1,
    list: [],
    currentTab: 0, //预设当前项的值,
    toView: ''
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    
    var self = this;
    var cur = e.currentTarget.dataset.current;
    var view = e.currentTarget.id;
    var state = e.currentTarget.dataset.state;

    if (this.data.currentTab == cur) { return false; }
    else {
      self.setData({
        currentTab: cur,
        toView: view,
        sId: state
      })
    }
    var orderTabs = this.data.orderTabs;
    for (var i = 0; i < orderTabs.length; i++) {
      if ('s'+orderTabs[i].id === this.data.toView) {
        if (i > 0) {
          self.setData({
            toView:'s'+orderTabs[i - 1].id
          })
        }
        break
      }
    }
    this.loadData();
  },
  //取消订单
  cancel: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '取消订单提醒',
      content: '确实要取消这个订单吗?',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({ title: '正在取消订单', mask: true })
          api.cancelOrder({ Id: id }, res => {
            wx.hideLoading()
            wx.showToast({
              title: '取消订单成功',
              icon: 'success',
              duration: 2000
            })
            that.loadData();
          });
        }
      }
    })
  },
  goToPay: function (e) {
    var that = this;
    var orderid = e.currentTarget.dataset.id;
    wx.showToast({ title: '获取支付信息……', icon: 'loading', duration: 5000 })

    api.payOrder({ Id: orderid, Repay: true }, pay => {
      wx.requestPayment({
        'timeStamp': pay.timeStamp,
        'nonceStr': pay.nonceStr,
        'package': pay.package,
        'signType': 'MD5',
        'paySign': pay.paySign,
        'success': function (res) {
          wx.navigateTo({ url: '../paysuccess/paysuccess' });
        },
        'fail': function (failRes) {
          if (failRes.errMsg.indexOf('cancel') >= 0)
            wx.showToast({ title: "用户取消支付", duration: 2000 });
          else
            wx.showToast({ title: failRes.errMsg, duration: 2000 });
        }
      });

    });
  },
  loadData() {
    var currentPage = this.data.page;
    api.getOrderList({ state: this.data.sId, page: currentPage }, res => {
      var ots = [];
      res.States.forEach((item, index) => {
        ots.push({ name: item.Name, id: item.Id })
      });
      this.setData({ orderTabs: ots, list: res.List });
      if (this.data.currentTab > 0) {
        var v = this.data.orderTabs[this.data.currentTab - 1]
        this.setData({
          toView: `s${v.Id}`
        })
      }
    });
  },
  confirmOrder: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var payload = { Id: id };
    api.userConfirmOrder(payload, res => {
      var tmpOrderList = that.data.list;
      for (var i = 0; i < tmpOrderList.length; i++) {
        var item = tmpOrderList[i];
        if (item.Id == payload.Id) {
          item.State = 4;
          item.StateText = "待评价";
          break;
        }
      }
      that.setData({ list: tmpOrderList });
      wx.showToast({ title: '确认收货成功' })
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var state = options.cur || 0;
    this.setData({ sId: state, currentTab: state });
    this.loadData();

    api.logVisit(this.route + api.jsonToPath(options), app.globalData.userInfo)

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

  }
})