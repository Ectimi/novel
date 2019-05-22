Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
  
  },
  data: {
    // 这里是一些组件内部数据
    selected: 0,
    color: 'rgb(161, 161, 161)',
    selectedColor: 'white',
    list: [
      {
        "pagePath": "/pages/index/index",
        "text": "首页"
      },
      {
        "pagePath": "/pages/classify/classify",
        "text": "分类"
      },
      {
        "pagePath": "/pages/rank/rank",
        "text": "排行榜"
      }
    ]
  },
  methods: {
    // 这里是一个自定义方法
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  }
})