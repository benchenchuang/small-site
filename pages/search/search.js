const app = getApp()
const api = require('../../utils/api.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showSearch: false,
    focus: true,
    disabled: false,
    keyword: "",
    searchShops: [],
    page: 1,
    pageSize: 10,
    totalPage: 1,
    isPull: false
  },
  resultShow: function (e) {
    this.setData({ isPull: true, keyword: e.detail.value });
    this.loadData();
  },
  loadData: function () {
    var params = {
      keyword: this.data.keyword,
      page: this.data.page,
      rawData: true,
      rnd: Math.random()
    };
    api.getGoodsList(params, res => {
      var totalPage = Math.ceil(res.total / this.data.pageSize);
      var tmpList = this.data.searchShops;
      if (this.data.isPull) {
        tmpList = [];
      }
      tmpList = tmpList.concat(res.data);
      this.setData({ searchShops: tmpList, totalPage: totalPage });
    });
  },
  addToCart: function (e) {
    wx.showLoading({ title: '正在加入购物车', mask: true })

    var params = {
      GoodsId: e.currentTarget.dataset.id,
      Quantity: 1
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
      var page = this.data.page + 1;
      this.setData({ page: page })
      this.loadData();
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})