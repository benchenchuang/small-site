//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
const api = require('../../utils/api.js')

Page({
  data: {
    disabled: true,
    indicatorDots: true,
    autoplay: true,
    circular: true,
    interval: 3000,
    duration: 500,
    ActiveColor: util.ActiveColor,
    indicatorColor: '#fff',
    noticeIcon: '../../image/icon-notice.png',
    brandHead: {
      url: '../../image/brand.png',
      name: '品牌专区'
    },
    newHead: {
      url: '../../image/new.png',
      name: '新品推荐'
    }
  },
  showShopAddress: function () {
    var self = this;
    wx.getLocation({
      success: function () {
        wx.openLocation({
          latitude: self.data.lat,
          longitude: self.data.lng,
          scale: 28
        })
      }
    })
  },
  shopCall: function () {
    wx.makePhoneCall({
      phoneNumber: app.globalData.contactPhone
    })
  },
  loadData() {
    api.getInexModel({ rnd: Math.random() }, res => {
      this.setData({
        address: res.Address,
        lat: res.lat,
        lng: res.lng,
        slides: res.Slides,
        notices: res.Notices,
        categories: res.Categories,
        categoryColors: res.CategoryColors,
        brands: res.Brands,
        goods: res.Goods,
        brandId: 0
      });
    });
  },
  // 加购物车
  addToCart: function (e) {
    wx.showLoading({ title: '正在加入购物车', mask: true })
    var goodsId = e.currentTarget.dataset.id;
    var params = { GoodsId: goodsId, Quantity: 1 };
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
  ///分类点击
  goToCategory(e) {
    var cate = e.currentTarget.dataset.name;
    wx.setStorageSync('cate_id', cate)
    wx.switchTab({ url: '../sort/sort' })
  },
  onLoad: function (options) {
    wx.showShareMenu();

    var scene = options.scene
    if (scene == undefined || scene.length <= 0) scene = "self";
    var rid = Math.random();
    wx.setStorageSync('usr', { scene: scene, rid: rid })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      ///记录轨迹
      api.logVisit(this.route, app.globalData.userInfo)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        ///记录轨迹
        api.logVisit(this.route, app.globalData.userInfo)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          ///记录轨迹
          api.logVisit(this.route, app.globalData.userInfo)
        }
      })
    }

    this.loadData();
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
