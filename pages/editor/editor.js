// pages/editor/editor.js
var marked = require("../../utils/marked.js");

function htmltowxml(htmlString) {
  var re = /<([a-z]+)>/g;

};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEditor: false,
    context: "",
    markdownFormat: [{
      tag: "h1",
      text: "123",
      src: null
    },
    {
      tag: "h2",
      text: "123",
      src: null
    },
    {
      tag: "h3",
      text: "123",
      src: null
    },
    {
      tag: "h4",
      text: "123",
      src: null
    },
    {
      tag: "h5",
      text: "123",
      src: null
    },
    {
      tag: "h6",
      text: "123",
      src: null
    },
    {
      tag: "p",
      text: "123",
      src: null
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isEditor: true,
      context: "## 123"
    });
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
  
  },


  getValue: function(event){
    this.setData({
      context: event.detail.value
    });
    console.log(this.data.context);
  },

  changeModel: function(event){
    wx.showLoading({
      title: "加载中",
      mask: true
    });

    if(this.data.isEditor){
      var htmlString = marked(this.data.context);
      console.log(htmlString);
      htmltowxml(htmlString);
    }

    this.setData({
      isEditor: !this.data.isEditor
    });

    wx.hideLoading();
  }
})