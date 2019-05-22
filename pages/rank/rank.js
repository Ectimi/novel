
Component({
  data:{
    major:['男生','女生','漫画','出版'],
    rankList:[]
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 2
        })
      }
    }
  },
  ready(){
    let that=this;
    wx.request({
      url: 'https://novel.juhe.im/rank-category',
      success(res){
        let arr=[];
        for(let key in res.data){
          if(key!='ok'){
            arr.push(res.data[key])
          }
        }
        that.setData({
          rankList:arr
        })
      }
    })
  },
  methods:{
    toRankingDetail(e) {
      let id=e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../rankingdetail/rankingdetail?id='+id,
      })
    }
  }
  
})
