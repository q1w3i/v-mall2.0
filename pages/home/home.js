// pages/home/home.js

import {getMultiData,getGoodsData} from '../../serveice/home'
const types = ['pop','new','sell']
const TOP_DISTANCE = 200

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners:[],
    recommends:[],
    titles:['流行','新款','精选'],
    goods:{
      'new':{page:0,list:[]},
      'pop':{page:0,list:[]},
      'sell':{page:0,list:[]}
    },
    currentType:'pop',
    showBackTop:false,
    isTabFixed:false,
    tabScrollTop:0
  },

  // 函数部分--------------------------
  // 监听Tabcontrol点击
  handleTabControlClick(event){
    const index = event.detail.index;
    const type = types[index]
    this.setData({
      currentType:type
    })
  },
      // 轮播图，推荐的数据
  _getMultiData(){
    getMultiData().then(res=>{
      const banners = res.data.data.banner.list;
      const recommends = res.data.data.recommend.list;
      // 放进data
      this.setData({
        banners:banners,
        recommends:recommends
      })
    })
  },
  // 商品信息
  _getGoodsData(type){
  // 获取页码
    const page = this.data.goods[type].page+1;
  //发送请求  
    getGoodsData(type,page).then((res)=>{
      const list = res.data.data.list;
      const oldList = this.data.goods[type].list;
      oldList.push(...list)
      const typeKey = `goods.${type}.list`
      const pageKey = `goods.${type}.page`
      this.setData({
        [typeKey]:oldList,
        [pageKey]:page
      })
    })
  },
  handleImageLoad(){
    wx.createSelectorQuery().select('#tab-control').boundingClientRect(rect =>{
      
      this.data.tabScrollTop = rect.top
    }).exec()
  },
  // 函数部分---------------------
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 轮播图，推荐的数据调用
    this._getMultiData();
    // 商品数据
    this._getGoodsData('pop');
    this._getGoodsData('new');
    this._getGoodsData('sell');
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
    this._getGoodsData(this.data.currentType)
  },
// 监听滚动
  onPageScroll(options){
    const scrollTop = options.scrollTop;
    const flag1 = scrollTop >= TOP_DISTANCE;
    if (flag1 != this.data.showBackTop){
      this.setData({
        showBackTop: flag1
      })
    }
    // 修改isTabFixed
    const flag2 = scrollTop >= this.data.tabScrollTop;
    if(flag2!=this.data.isTabFixed){
      this.setData({
        isTabFixed:flag2
      })
    }
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})