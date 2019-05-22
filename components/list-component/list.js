Component({
  properties: {
    bookLists: Array,
    bookType: Array,
    rankType:Array,
    start: Number
  },

  data: {
    typeSelected: 0,

  },
  methods: {
    toBookDetail(e) {
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `../bookdetail/bookdetail?id=${id}`,
      })
    },
    selectType(e) {
      let that = this;
      let type = e.currentTarget.dataset.type
      this.setData({
        allBooks: [],
        typeSelected: e.currentTarget.dataset.index,
        start: 0
      })
      if (type == '全部') {
        that.setData({
          selectedType: '',
          bookLists: [],
          start: 0
        })
        this.triggerEvent('setType', {
          'type': this.data.selectedType,
          'bookLists': this.properties.bookLists,
          'start': this.properties.start
        });
        this.triggerEvent('loadBooks');
        return;
      }
      that.setData({
        selectedType: type,
        bookLists: [],
        start: 0
      })
      this.triggerEvent('setType', {
        'type': this.data.selectedType,
        'bookLists': this.properties.bookLists,
        'start': this.properties.start
      });
      this.triggerEvent('loadBooks');
    },
  }
})