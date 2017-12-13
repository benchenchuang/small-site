// pages/shop_detail/shop_detail.js
const app = getApp();
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    circular: true,
    interval: 3000,
    duration: 500,
    ActiveColor: util.ActiveColor,
    indicatorColor: '#fff',
    quantity: 1,
    details: {},
    submitType: 'cart',//类型 默认加入购物车   
    detaiHead: {
      url: '../../image/icon-shop-detail.png',
      name: '商品详情'
    }

  },
  tapPhone: function () {
    wx.makePhoneCall({
      phoneNumber: app.globalData.contactPhone,
    })
  },
  addCart: function (e) {
    wx.showLoading({ title: '正在加入购物车', mask: true })
    var params = {
      GoodsId: this.data.details.Id,
      Quantity: this.data.quantity
    };
    api.addToCart(params, res => {
      wx.hideLoading()
      if (res) {
        wx.showToast({
          title: '已加入购物车',
          icon: 'success',
          duration: 2000
        })
      }
    });
  },
  //确定
  buy: function (e) {
    wx.showLoading({ title: '正在生成订单', mask: true })
    var items = [{
      GoodsId: this.data.details.Id,
      Quantity: this.data.quantity
    }];
    api.buy({ Items: items }, res => {
      wx.hideLoading()
      if (res > 0) {
        wx.navigateTo({ url: '../confirm_order/confirm_order?id=' + res });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var that = this;
    api.getGoodsInfo({ id: id }, res => {
      that.setData({ details: res });
      var article = res.Contents;
      /**
      * WxParse.wxParse(bindName , type, data, target,imagePadding)
      * 1.bindName绑定的数据名(必填)
      * 2.type可以为html或者md(必填)
      * 3.data为传入的具体数据(必填)
      * 4.target为Page对象,一般为this(必填)
      * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
      */
      WxParse.wxParse('article', 'html', article, that, 5);
    });
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