let timeout,timeout2;
let doing=false;
let doing2=false;

Page({
  data: {
    bookName: '',
    title: '',
    textArr: [],
    text: '',
    catalogList: [],
    link: '',
    currentChapter: 0,
    currentPos:0,
    loading: false,
    selected: 0,
    theme: 'default',
    titleFontSize: 18,
    contentFontSize: 16,
    fontSize: 2,
    progressWidth: 50,
    existChapter:[],
    heightArr:[],
    //动画
    animationData: {},
    catalogAniData: {},
    show: false,
    catalogShow: false
  },

  onLoad: function(options) {
    let that = this;
    let page = getCurrentPages();
    let catalogPage = page.filter(item => {
      return item.route == 'pages/catalog/catalog'
    })
    that.setData({
      bookName: options.name,
      catalogList: catalogPage[0].__data__.chapterList,
      currentChapter: options.id,
      textArr: [],
    })
    that.loadText(0)
  },
  onReady() {
    this.animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear'
    })
    this.catalogAni = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear'
    })
  },
  showMask(e) {
    if (!this.data.show && !this.data.catalogShow) {
      this.animation.bottom(-70).step();
      this.setData({
        animationData: this.animation.export(),
        catalogAniData: this.catalogAni.export(),
        show: true
      })
      return;
    } else if (this.data.show) {
      this.animation.bottom(-240).step();
      this.setData({
        animationData: this.animation.export(),
        show: false
      })
      return;
    }
    this.catalogAni.left('-80%').step();
    this.setData({
      catalogAniData: this.catalogAni.export(),
      catalogShow: false
    })
  },
  showCatalog() {
    this.animation.bottom(-240).step();
    this.catalogAni.left(0).step();
    this.setData({
      animationData: this.animation.export(),
      catalogAniData: this.catalogAni.export(),
      catalogShow: true,
      show: false
    })
  },
  onPageScroll(e) {
    let pageHeight, windowHeight;
    let query = wx.createSelectorQuery();
    let that = this;
    
    wx.getSystemInfo({
      success: function(res) {
        query.select('.chapter-detail').boundingClientRect(rect => {
          pageHeight = rect.height;
          windowHeight = res.windowHeight;
          if (!timeout2) {
            timeout2 = setTimeout(() => {
              let len = that.data.heightArr.length;
              for (let i = 0; i < len; i++) {
                if (e.scrollTop + windowHeight < that.data.heightArr[i]) {
                  that.setData({
                    currentPos: that.data.existChapter[that.data.heightArr.indexOf(that.data.heightArr[i])]
                  })
                  break;
                }
              }
              timeout2=null;
            }, 100)
          }
          if (e.scrollTop >= pageHeight - windowHeight-20) {
            if (that.data.currentChapter < that.data.catalogList.length - 1) {
              if(!timeout){
                timeout = setTimeout(function () {
                  if(!doing){
                    doing=true;
                    that.loadText(1);
                  }
                  timeout = null;
                }, 40)
              }
            }
          }
        }).exec();
      },
    })
    
   
  },
  loadText(isSet) {
    let that = this;
    let hArr = [];
    if (isSet) {
      that.setData({
        currentChapter: Number(that.data.currentChapter) + 1,
        loading: true,
      })
    }
    if (!that.data.catalogList[that.data.currentChapter].isVip){
      wx.request({
        url: 'http://novel.juhe.im/chapters/' + encodeURIComponent(that.data.catalogList[that.data.currentChapter].link),
        success(res) {
          let arr = that.data.textArr;
          let existArr = that.data.existChapter;
          existArr.push(+that.data.currentChapter)
          arr.push({
            'title': res.data.chapter.title,
            'text': res.data.chapter.cpContent
          })
          that.setData({
            textArr: arr,
            loading: false,
            existChapter: existArr,
            currentPos: that.data.currentChapter
          });
          wx.createSelectorQuery().selectAll('.box').boundingClientRect(rects => {
            rects.forEach(rect => {
              hArr.push(rect.height)
              hArr[hArr.length - 1] = hArr.reduce((previous, current) => {
                return previous + current;
              })
              that.setData({
                heightArr: hArr
              })
            })
          }).exec();
          let t = setTimeout(() => {
            doing = false;
            t = null;
          }, 2000)

        }
      })
    }
   
  },
  //设置主题
  changeTheme(e) {
    let type = e.currentTarget.dataset.type;
    if (type == 0) {
      this.setData({
        theme: 'default',
        selected: 0
      })
    } else if (type == 1) {
      this.setData({
        theme: 'night',
        selected: 1
      })
    } else if (type == 2) {
      this.setData({
        theme: 'protect',
        selected: 2
      })
    }
  },
  //设置字体
  setFontSize(e) {
    let type = e.currentTarget.dataset.type;
    if (type == 'add') {
      if (this.data.fontSize < 4) {
        this.setData({
          fontSize: this.data.fontSize + 1,
          contentFontSize: this.data.contentFontSize + 1,
          titleFontSize: this.data.titleFontSize + 1,
          progressWidth: this.data.progressWidth + 25
        })
      }
    } else if (type == 'sub') {
      if (this.data.fontSize > 0) {
        this.setData({
          fontSize: this.data.fontSize - 1,
          contentFontSize: this.data.contentFontSize - 1,
          titleFontSize: this.data.titleFontSize - 1,
          progressWidth: this.data.progressWidth - 25
        })
      }
    }
  },
  turnPage(e) {
    let type = e.currentTarget.dataset.type;
    if (type == 'pre') {
      if (this.data.currentChapter > 0) {
        this.setData({
          currentChapter: Number(this.data.currentChapter) - 1,
          textArr: [],
          existChapter:[]
        })
      } else {
        return;
      }
    } else if (type == 'next') {
      if (this.data.currentChapter < this.data.catalogList.length - 1) {
        this.setData({
          currentChapter: Number(this.data.currentChapter) + 1,
          textArr: [],
          existChapter: []
        })
      } else {
        return;
      }
    }
    this.loadText(0);
  },
  selectChapter(e) {
    this.catalogAni.left('-80%').step();
    let index = e.currentTarget.dataset.index;
    this.setData({
      currentChapter: index,
      textArr: [],
      catalogAniData: this.catalogAni.export(),
      existChapter: []
    })
    this.loadText(0);
  }
})