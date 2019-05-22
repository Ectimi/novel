import {calcDay} from '../../utils/util.js'
Page({
  data: {
    id:'',
    bookInfo:{},
    hideText:true,
    //书源
    source:'',
    //书源ID
    sID:'',
    //推荐
    recommend:'',
    //按钮属性
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false,
    //最新章节
    lastChapter:''
  },
  // setId(e){
  //   this.setData({
  //     id:e.currentTarget.dataset.id
  //   })
  //   this.loadBookDetail();
  // },
  loadBookDetail(){
    let that = this;
    
    wx.request({
      url: 'http://novel.juhe.im/book-info/' + that.data.id,
      success(res) {
        that.setData({
          bookInfo: res.data
        })
        that.setData({
          'bookInfo.cover': 'http://statics.zhuishushenqi.com' + res.data.cover,
          'bookInfo.wordCount': Math.ceil(res.data.wordCount / 10000),
          'bookInfo.updated': calcDay(res.data.updated),
          'bookInfo.latelyFollower': that.followerCount(res.data.latelyFollower)
        })
      }
    })
    //书源
    wx.request({
      url: 'https://novel.juhe.im/book-sources?view=summary&book=' + that.data.id,
      success(res) {
        console.log(res.data)
        that.setData({
          lastChapter: res.data[0].lastChapter,
          source: res.data[0].name,
          sID: res.data[0]._id
        })
      }
    })
    //推荐
    wx.request({
      url: 'https://novel.juhe.im/recommend/' + that.data.id,
      success(res) {
        res.data.books.map(item => {
          item.cover = 'http://statics.zhuishushenqi.com' + item.cover
        })
        that.setData({
          recommend: res.data.books
        })
        console.log(that.data.recommend)
      }
    })
  },

  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    this.loadBookDetail(options.id)
  },
 
  followerCount(num){
    if(num<10000){
      return num;
    }
    let res=num/10000;
    if(res==0){
      return res;
    }else{
      return Math.round(res.toFixed(2))+'万';
    }
  },
  showAll(){
    this.setData({
      hideText:!this.data.hideText
    })
  },
  toComment(){
    wx.navigateTo({
      url: `../comment/comment?title=${this.data.bookInfo.title}&id=${this.data.bookInfo._id}`,
    })
  },
  toCatalog(){
    wx.navigateTo({
      url: `../catalog/catalog?source=${this.data.source}&sid=${this.data.sID}&name=${this.data.bookInfo.title}`,
    })
  },
 
})