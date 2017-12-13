const app = getApp();
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    pageSize: 10,
    totalPage: 1,
    isPull: false
  },
  ///加载数据
  loadData() {
    var params = {
      page: this.data.page,
      rawData: true,
    }
    api.getOrderEvaluationList(params, res => {
      var totalPage = Math.ceil(res.total / this.data.pageSize);
      var tmpList = this.data.list;
      if (this.data.isPull) {
        tmpList = [];
      }
      tmpList = tmpList.concat(res.data);
      this.setData({ list: tmpList, totalPage: totalPage })
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.setData({ isPull: true });
    wx.stopPullDownRefresh();
    this.loadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({ isPull: false });
    if (this.data.page < this.data.totalPage) {
      this.loadData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})