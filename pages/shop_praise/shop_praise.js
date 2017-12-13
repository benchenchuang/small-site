// pages/shop_praise/shop_praise.js
const app = getApp()
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid: 0
  },
  // 提交评价
  formSubmit: function (e) {
    var that = this;
    var contents = e.detail.value.Contents;

    if (contents.length <= 0) {
      wx.showModal({
        title: '信息提示',
        content: '请输入评价内容',
      })
      return false;
    }
    wx.showLoading({ title: '正在提交评价', mask: true })
    var params = {
      Id: this.data.orderid,
      Contents: contents,
    };
    api.appraiseOrder(params, pay => {
      wx.hideLoading();
      wx.showToast({
        title: "提交评价成功", duration: 2000, success: function () {
          wx.redirectTo({ url: '../orders/orders?cur=4&id=s4' });
        }
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ orderid: options.id })

    var that = this;
    api.getOrder({ id: that.data.orderid, addressid: 0 }, res => {
      var _submitOrderDisable = (res.LinkMan.length <= 0) || (res.LinkMan.length <= 0) || (res.Address.length <= 0);
      this.setData({ details: res, submitOrderDisable: _submitOrderDisable });
    })

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})