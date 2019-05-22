// pages/booklist/booklist.js
import {debounce} from '../../utils/util.js'
let timers=[];
Page({
  data: {
    subCategroy:{},
    major:'',
    word:'',
    classification:['热门','新书','好评','完结','包月'],
    bookType:[],
    classSelected:0,
    typeSelected:0,
    bookLists:[],
    start:0,
    count:20,
    isLoading:false,
    selectedType:'',
  },
  onLoad: function (options) {
    let that=this;
    that.setData({
      major:options.major,
      word:options.word
    })
    new Promise(resolve=>{
      wx.request({
        url: 'https://novel.juhe.im/sub-categories',
        success(res) {
          that.setData({
            subCategroy: res.data
          })
          for (let key in that.data.subCategroy) {
            if (key == that.data.major) {
              that.data.subCategroy[key].forEach(item => {
                if (item.major == that.data.word) {
                  that.setData({
                    bookType: ['全部', ...item.mins]
                  })
                }
              })
            }
          }
          resolve();
        }
      })
    }).then(data=>{
      that.loadBooks();
    })
  },
  reverseCount(number){
    if(number<10000){
      return number;
    }
    return Math.floor(number/1000)+'万';
  },
  loadBooks(){
    let that=this;
    const url = `https://novel.juhe.im/category-info?gender=${that.data.major}&type=hot&major=${that.data.word}&minor=${that.data.selectedType}&start=${that.data.start}&limit=${that.data.count}`
    that.setData({
      isLoading:true,
      url:url
    })
    wx.request({
      url: encodeURI(url),
      success(res) {
        let result = res.data.books;
        let arr=that.data.bookLists;
        if(result.length>0){
          result.map(item => {
            item.cover = "http://statics.zhuishushenqi.com" + item.cover;
            item.latelyFollower = that.reverseCount(item.latelyFollower);
            arr.push(item);
          })
          that.setData({
            bookLists: arr,
            start: that.data.start + that.data.count,
            isLoading:false
          })
          timers = [];
        }
      }
    })
  },
  setType(e){
    this.setData({
      selectedType:e.detail.type,
      bookLists:e.detail.bookLists,
      start:e.detail.start
    })
  },
  onPageScroll(e) {
    let pageHeight, windowHeight;
    let query = wx.createSelectorQuery();
    let that = this;

    wx.getSystemInfo({
      success: function (res) {
        query.select('.booklist').boundingClientRect(rect => {
          pageHeight = rect.height;
          windowHeight = res.windowHeight;
          if (e.scrollTop >= pageHeight - windowHeight - 50) {
            debounce(timers, that.loadBooks, 40)
          }
        }).exec();
      },
    })
  },
})