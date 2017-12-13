const app = getApp()
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid: 0
  },
  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: app.globalData.contactPhone
    })
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
            wx.redirectTo({
              url: '../orders/orders',
            })
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
  loadData: function () {
    var that = this;
    api.getOrder({ id: that.data.orderid, addressid: 0 }, res => {
      var _submitOrderDisable = (res.LinkMan.length <= 0) || (res.LinkMan.length <= 0) || (res.Address.length <= 0);
      this.setData({ details: res, submitOrderDisable: _submitOrderDisable });
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ orderid: options.id, imgUrl: app.globalData.imgUrl })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})