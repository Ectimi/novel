Page({
  data: {
    searchResult:[],
    keyword:''
  },

  onLoad: function (options) {
    let that=this;
    that.setData({
      keyword:options.keyword
    })
    wx.request({
      url: 'http://novel.juhe.im/search?keyword='+options.keyword,
      success(res) {
        let result = res.data.books;
        if (result.length > 0) {
          result.map(item => {
            item.cover = "http://statics.zhuishushenqi.com" + item.cover;
          })
          that.setData({
            searchResult:result
          })
        }
      }
    })
  },
})