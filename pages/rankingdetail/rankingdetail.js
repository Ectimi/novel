// pages/rankingdetail/rankingdetail.js
Page({
  data: {
    bookLists:[],
    rankType:['周榜','月榜','总榜'],
    title:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id=options.id;
    let that=this;
    wx.request({
      url: 'http://novel.juhe.im/rank/'+id,
      success(res){
        let result = res.data.ranking.books;
        let arr = that.data.bookLists;
        if (result.length > 0) {
          result.map(item => {
            item.cover = "http://statics.zhuishushenqi.com" + item.cover;
            arr.push(item);
          })
          that.setData({
            title: res.data.ranking.title,
            bookLists: res.data.ranking.books
          })
        }
        console.log(that.data.bookLists)
      }
    })
  },
})