import {debounce} from '../../utils/util.js';
let timers=[];
let timeout;
Page({
  data: {
    chapterNum:'',
    chapterList:[],
    sortType:0,
    bookName:'',
    load:false,
  },
  onLoad: function (options) {
    let that=this;
    that.setData({
      bookName:options.name,
      load:true
    })
    wx.request({
      url: 'https://novel.juhe.im/book-chapters/'+options.sid,
      success(res){
        that.setData({
          chapterList: res.data.chapters,
          chapterNum:res.data.chapters.length,
          load:false
        })
      }
    })
  },
 
  sort(){
    this.setData({
      sortType:this.data.sortType+1,
      chapterList:this.data.chapterList.reverse()
    })
  },
  toChapterDetail(e){
    if(e.currentTarget.dataset.vip){
      return;
    }
    let link=e.currentTarget.dataset.link;
    let index=e.currentTarget.dataset.index;
    wx.navigateTo({
      url: `../chapterdetail/chapterdetail?id=${index}&name=${this.data.bookName}&link=${link}`,
    })
  },
})