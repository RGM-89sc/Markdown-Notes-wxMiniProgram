//index.js
//获取应用实例
const app = getApp()

var util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    showArticleList: true,
    newArticle: false,

    articles: [],

    articlesNum: 0,
    newArticleTitle: null,
    titleLen: 24
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

    wx.navigateTo({
      url: '../editor/editor',
    })


    this.setData({
      articles: app.globalData.articles,
      articlesNum: app.globalData.articlesNum
    });


    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
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
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  // 点击“我的文章”选项卡
  myArticle: function(event){
    this.setData({
      showArticleList: true,
      newArticle: false
    });
  },

  // 点击“新建文章”选项卡
  newArticle: function(event){
    this.setData({
      showArticleList: false,
      newArticle: true
    });
  },

  // 当在“新建文章”中输入标题时
  titleInput: function(event){
    this.setData({
      newArticleTitle: event.detail.value,
      titleLen: 24 - event.detail.value.length
    });
  },


  // 在“新建文章”中点击“确认”
  new: function(event){
    // 文章总数增1
    app.globalData.articlesNum += 1;
    this.data.articlesNum += 1;
    // 如果填写了标题则新建文章，否则提示未填写
    if (this.data.newArticleTitle){
      // 显示“加载中”的提示
      wx.showLoading({
        title: "加载中",
        mask: true
      });
      // app全局变量articles增加一篇文章
      app.globalData.articles.push({
        id: app.globalData.articlesNum.toString(),
        title: this.data.newArticleTitle,
        date: util.formatTime(new Date)
      });
      // page全局变量articles增加一篇文章
      this.setData({
        articles: app.globalData.articles,
        articlesNum: app.globalData.articlesNum,
        newArticleTitle: "",
        titleLen: 24
      });
      // 跳转到编辑页面
      wx.navigateTo({
        url: "../editor/editor?id={{app.globalData.articlesNum.toString()}}",
      });
      // 关闭“加载中”的提示
      wx.hideLoading();
    } else {
      wx.showToast({
        title: "标题不能为空",
        mask: true,
        icon: "none",
        duration: 1000
      })
    }
  }
})
