import {
  debounce
} from '../../utils/util.js';
let timers = [];
Page({
  data: {
    id: '',
    title: '',
    start: 0,
    limit: 20,
    commentInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.setData({
      id: options.id,
      title: options.title
    })
    that.loadComment();
  },
  onPageScroll(e) {
    let pageHeight, windowHeight;
    let query = wx.createSelectorQuery();
    let that = this;

    wx.getSystemInfo({
      success: function(res) {
        query.select('.comment').boundingClientRect(rect => {
          pageHeight = rect.height;
          windowHeight = res.windowHeight;
          that.data.opacity = parseInt(e.scrollTop / 25);
          if (e.scrollTop >= pageHeight - windowHeight - 50) {
            debounce(timers, that.loadComment, 40)
          }
        }).exec();
      },
    })
  },
  loadComment() {
    let that = this;
    wx.request({
      url: `https://novel.juhe.im/book/reviews?book=${that.data.id}&start=${that.data.start}&limit=${that.data.limit}`,
      success(res) {
        let arr = that.data.commentInfo;
        let r = res.data;
        r.reviews.map(item => {
          item.author.avatar = "http://statics.zhuishushenqi.com" + item.author.avatar;
          if (arr.reviews) {
            arr.reviews.push(item);
          }
        })
        that.setData({
          commentInfo: arr.reviews ? arr : r,
          start: that.data.start + that.data.limit
        })
        timers = [];
        console.log(that.data.commentInfo);
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})