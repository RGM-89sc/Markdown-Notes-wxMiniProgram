//index.js
//获取应用实例
const app = getApp()

var util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    notes: [],

    notesNum: 0,
    newNoteTitle: null,
    titleLen: 24,

    addPanel: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

    // wx.navigateTo({
    //   url: '../editor/editor',
    // })

    // 初始化notes数据
    this.setData({
      notes: app.globalData.notes,
      notesNum: app.globalData.notesNum
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

  // 点击了添加文章按钮
  add: function(){
    this.setData({
      addPanel: true,
    });
  },

  // 关闭添加文章的面板
  hiddenAdd: function(){
    this.setData({
      addPanel: false,
      titleLen: 24,
      newNoteTitle: null
    });
  },

  // 当在“新建文章”中输入标题时
  titleInput: function(event){
    this.setData({
      newNoteTitle: event.detail.value,
      titleLen: 24 - event.detail.value.length
    });
  },


  // 在“新建文章”中点击“确认”
  new: function(event){
    // 文章总数增1
    app.globalData.notesNum += 1;
    this.data.notesNum += 1;
    // 如果填写了标题则新建文章，否则提示未填写
    if (this.data.newNoteTitle){
      // 如果第一个字符不是空格
      if (this.data.newNoteTitle[0] != " "){
        // 显示“加载中”的提示
        wx.showLoading({
          title: "加载中",
          mask: true
        });
        // app全局变量notes增加一篇文章
        app.globalData.notes.unshift({
          id: app.globalData.notesNum.toString(),
          title: this.data.newNoteTitle,
          date: util.formatTime(new Date)
        });
        // page全局变量notes增加一篇文章
        this.setData({
          notes: app.globalData.notes,
          notesNum: app.globalData.notesNum,
          newNoteTitle: "",
          titleLen: 24,

          addPanel: false
        });
        // 跳转到编辑页面
        wx.navigateTo({
          url: "../editor/editor?id={{app.globalData.notesNum.toString()}}",
        });
        // 关闭“加载中”的提示
        wx.hideLoading();
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

  // 长按post
  conf: function(event){
    console.log(event.target);
    var that = this;
    wx.showActionSheet({
      itemList: ["删除"],
      success: function (res) {
        if(res.tapIndex == 0){
          // app全局变量notes减少一篇文章
          app.globalData.notes = app.globalData.notes.filter(function(value, index){
            return value.id != event.target.dataset.id;
          });
          // page全局变量notes减少一篇文章
          that.setData({
            notes: app.globalData.notes,
            notesNum: app.globalData.notesNum
          });

          /* 【此处写与后台从数据库中删除这个note的交互】 */
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }
})
