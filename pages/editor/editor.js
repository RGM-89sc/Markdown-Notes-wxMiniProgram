// pages/editor/editor.js
var marked = require("../../utils/marked.js"),
  WxParse = require('../../wxParse/wxParse.js');

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: null,
    isEditor: false,
    context: "",

    changeNoteTitle: false,
    newNoteTitle: null,

    titleLen: 24,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 请求后台获取本note的内容
    wx.request({
      url: '',
      data: {
        id: options.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)  // note的内容，要设置到this.data中去
      }
    });
    
    this.setData({
      options: options,
      isEditor: true,
      context: "# 此处为一级标题"
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: 'MarkNote',
      path: 'pages/index/index'
    }
  },


  getValue: function(event){
    this.setData({
      context: event.detail.value
    });
  },

  changeModel: function(event){
    wx.showLoading({
      title: "加载中",
      mask: true
    });

    if(this.data.isEditor){
      var article = marked(this.data.context);
      
      var that = this;
      WxParse.wxParse('article', 'html', article, that, 5);
    }

    this.setData({
      isEditor: !this.data.isEditor
    });

    wx.hideLoading();
  },

  // 关闭更改便笺标题的面板
  hiddenChange: function () {
    this.setData({
      changeNoteTitle: false,
      titleLen: 24,
      newNoteTitle: null
    });
  },

  // 当在“更改便笺标题”中输入标题时
  titleInput: function (event) {
    this.setData({
      newNoteTitle: event.detail.value,
      titleLen: 24 - event.detail.value.length
    });
  },

  // 确定修改标题
  change: function(){
    // 如果填写了标题则修改标题，否则提示未填写
    if (this.data.newNoteTitle) {
      // 如果第一个字符不是空格
      if (this.data.newNoteTitle[0] != " ") {
        var that = this;
        app.globalData.notes.forEach(function (value) {
          if (value.id === that.data.options.id) {
            value.title = that.data.newNoteTitle;
            return null;
          }
        });

        // 请求后台更改标题
        wx.request({
          url: '',
          data: {
            id: that.data.options.id,
            newTitle: that.data.newNoteTitle
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res.data)
          }
        })

        // 给出成功的提示
        wx.showToast({
          title: '已更改',
          icon: 'success',
          duration: 1200
        })

        this.setData({
          changeNoteTitle: false
        });
      } else {
        this.setData({
          titleLen: 24,
          newNoteTitle: null
        });

        wx.showToast({
          title: "标题第一个字符不能为空格",
          mask: true,
          icon: "none",
          duration: 1400
        })
      }
    } else {
      wx.showToast({
        title: "标题不能为空",
        mask: true,
        icon: "none",
        duration: 1000
      })
    }
  },

  moreMenu: function(event){
    var that = this;
    wx.showActionSheet({
      itemList: ["更改标题", "删除便笺"],
      success: function (res) {
        if(res.tapIndex == 0){
          that.setData({
            changeNoteTitle: !that.data.changeNoteTitle
          });
        }
        if(res.tapIndex == 1){
          // 请求后台删除note
          wx.request({
            url: '',
            data: {
              deleteID: that.data.options.id,
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res.data)
            }
          })

          wx.navigateBack({
            data: 1
          });
          app.globalData.deleteID = that.data.options.id;
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }
})