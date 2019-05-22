Component({
  data: {
    majorCategory: ['男生', '女生', '漫画', '出版'],
    classiftyList: []
  },

  ready() {
    let that = this;
    wx.request({
      url: 'https://novel.juhe.im/categories',
      success(res) {
        let arr = [];
        for (let key in res.data) {
          if (key != 'ok') {
            arr.push(res.data[key])
          }
        }
        that.setData({
          classiftyList: arr

        })
      }
    })
  },
  methods: {
    toBookList(e) {
      let major = e.currentTarget.dataset.major
      let word = e.currentTarget.dataset.word;
      wx.navigateTo({
        url: `../booklist/booklist?major=${this.conversionMajor(major)}&word=${word}`,
      })
    },
    conversionMajor(major) {
      switch (major) {
        case '男生':
          return 'male';
        case '女生':
          return 'female';
        case '漫画':
          return 'picture';
        case '出版':
          return 'press'
      }
    }
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
    }
  }
})