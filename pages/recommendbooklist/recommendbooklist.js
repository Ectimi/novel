import {
  debounce
} from '../../utils/util.js';
let timers = []
Page({
  data: {
    selected: 0,
    loading: false,
    start: 0,
    //本周最热：sort=collectorCount & duration=last-seven-days & start=0
    //最新发布是: sort = created & duration=all
    //最多收藏是: sort=collectorCount & duration=all
    sort: 'collectorCount',
    duration: 'last-seven-days',
    bookType: [{
        type: '本周最热',
        sort: 'collectorCount',
        duration: 'last-seven-days'
      }, {
        type: '最新发布',
        sort: 'created',
        duration: 'all'
      },
      {
        type: '最多收藏',
        sort: 'collectorCount',
        duration: 'all'
      }
    ],
    bookLists: []
  },

  onLoad: function(options) {
    this.loadBookList();
  },
  onPageScroll(e) {
    let pageHeight, windowHeight;
    let query = wx.createSelectorQuery();
    let that = this;

    wx.getSystemInfo({
      success: function(res) {
        query.select('.recommend-book-list').boundingClientRect(rect => {
          pageHeight = rect.height;
          windowHeight = res.windowHeight;
          if (e.scrollTop >= pageHeight - windowHeight - 50) {
            debounce(timers, that.loadBookList, 40)
          }
        }).exec();
      },
    })
  },
  selectType(e){
    let index=e.currentTarget.dataset.index;
    this.setData({
      selected:index,
      bookLists:[],
      sort:this.data.bookType[index].sort,
      duration:this.data.bookType[index].duration,
      start:0
    })
    this.loadBookList();
  },
  loadBookList() {
    let that = this;
    let list = that.data.bookLists;
    that.setData({
      loading: true
    })
    wx.request({
      url: `https://novel.juhe.im/booklists?sort=${that.data.sort}&duration=${that.data.duration}&start=${that.data.start}`,
      success(res) {
        that.setData({
          bookLists: [...list, ...res.data.bookLists],
          start: that.data.start + 20,
          loading: false
        })
        timers = [];
        console.log(that.data.bookLists)
      }
    })
  },
  toRecommendBookListDetail(e){
    wx.navigateTo({
      url: '../recommendbooklistdetail/recommendbooklistdetail?id='+e.currentTarget.dataset.id,
    })
  }
})