import {calcDay} from '../../utils/util.js';
Page({
  data: {
    bookList:''
  },

  onLoad: function (options) {
    let that=this;
    wx.request({
      url: 'https://novel.juhe.im/booklists/'+options.id,
      success(res){
        res.data.bookList.updated = calcDay(res.data.bookList.updated)
        that.setData({
          bookList:res.data.bookList,
          
        })
        console.log(that.data.bookList)
      }
    })
    
  },
  toBookDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../bookdetail/bookdetail?id=${id}`,
    })
  },
})