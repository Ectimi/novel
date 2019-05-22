import {random} from '../../utils/util.js'
Component({
  data:{
    classify:[],
    bannerImageList:[
      'http://statics.zhuishushenqi.com/recommendPage/155436246883886',
      'http://statics.zhuishushenqi.com/recommendPage/155436251773119',
      'http://statics.zhuishushenqi.com/recommendPage/155436254396199',
      'http://statics.zhuishushenqi.com/recommendPage/155436257823132'
    ],
    //全部热词
    allHotWord:[],
    //展示的热词
    showHotWord:[],
    //热词展示数量
    hotCount:10,
    //推荐词展示数量
    recommendCount:6,
    //全部推荐词
    allRecommendWord:[],
    //展示的推荐词
    showRecommendWord:[],
    //是否正在搜索
    isSearch:false,
    //输入补全提示
    inputTips:[],
    //输入框的值
    inputValue:'',
    //swiper组件属性
    indicatorDots:true,
    indicatorColor:'rgb(228, 206, 196)',
    indicatorActiveColor:'rgb(210, 96, 80)',
    autoplay:true,
    current:0,
    interval:10000,
    duration:500,
    circular:true
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
    },
  },
  ready(){
    this.loadWords('https://novel.juhe.im/search-hotwords','hot');
    this.loadWords('https://novel.juhe.im/hot-books')
  },
  
  methods:{
    loadWords(url,type) {
      let that=this;
      wx.request({
        url,
        success(res) {
          if(type=='hot'){
            that.setData({
              allHotWord: res.data.searchHotWords,
              showHotWord: random(that.data.hotCount, res.data.searchHotWords, 0)
            })
          }else{
            that.setData({
              allRecommendWord: res.data.newHotWords,
              showRecommendWord: random(that.data.recommendCount, res.data.newHotWords, 0)
            })
          }
        }
      })
    },
    change(e){
      let type=e.currentTarget.dataset.type;
      if(type=='hot'){
        this.setData({
          showHotWord: random(this.data.hotCount, this.data.allHotWord, 0)
        })
      }else if(type=='recommend'){
        this.setData({
          showRecommendWord: random(this.data.recommendCount, this.data.allRecommendWord, 0)
        })
      }
    },
    showSearch(){
      this.setData({
        isSearch:true
      })
    },
    hideSearch(){
      this.setData({
        isSearch: false,
        inputValue:''
      })
    },
    inputCompletion(e){
      let that=this;
      wx.request({
        url: 'https://novel.juhe.im/auto-complete?query='+e.detail.value,
        success(res){
          that.setData({
            inputTips: res.data.keywords,
            inputValue:e.detail.value
          })
        }
      })
      
    },
    search(e){
      if(e.currentTarget.dataset.keyword){
        wx.navigateTo({
          url: '../searchresult/searchresult?keyword=' + e.currentTarget.dataset.keyword,
        })
        this.setData({
          inputValue: '',
          inputTips: [],
          isSearch: false
        })
        return;
      }
      if (this.data.inputValue != ''){
        wx.navigateTo({
          url: '../searchresult/searchresult?keyword=' + this.data.inputValue,
        })
        this.setData({
          inputValue: '',
          inputTips:[],
          isSearch:false
        })
      }
    },
    toRecommentBookList(){
      wx.navigateTo({
        url: '../recommendbooklist/recommendbooklist',
      })
    }
  }
  
})
