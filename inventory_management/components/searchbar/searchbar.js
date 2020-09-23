Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    focus: {
      type: Boolean,
      value: false
    },
    placeholder: {
      type: String,
      value: '搜索'
    },
    value: {
      type: String,
      value: ''
    },
    search: {
      type: Function,
      value: null
    },
    throttle: {
      // 500ms内只会调用一次search函数
      type: Number,
      value: 500
    },
    confirmText: {
      type: String,
      value: '搜索'
    },
    autoSearch: {
      type: Function,
      value: null
    },
    slideButtons: {
      type: Array,
      value: []
    },
    buttonText: {
      type: String,
      value: ''
    },
    onLoadSearch: {
      type: Boolean,
      value: false
    },
    triggerSearch: {
      type: Boolean,
      value: false,
      observer: '_triggerSearch'
    }
  },
  data: {
    result: [] // 搜索结果
  },

  lastSearch: Date.now(),
  lifetimes: {
    attached() {
      if (this.data.focus) {
        this.setData({
          searchState: true
        });
      }
    }
  },
  pageLifetimes: {
    show() {
      if (this.data.onLoadSearch) {
        this.search();
      }
    }
  },
  methods: {
    clearInput() {
      this.setData({
        value: '',
        focus: true,
      });
      this.triggerEvent('clear');
    },

    inputFocus(e) {
      this.triggerEvent('focus', e.detail);
    },

    inputBlur(e) {
      this.setData({
        focus: false
      });
      this.triggerEvent('blur', e.detail);
    },

    showInput() {
      this.setData({
        focus: true,
        searchState: true
      });
    },

    hideInput() {
      this.setData({
        searchState: false
      });
    },

    inputChange(e) {
      this.setData({
        value: e.detail.value
      });
      this.triggerEvent('input', e.detail);

      if (Date.now() - this.lastSearch < this.data.throttle) {
        return;
      }

      if (typeof this.data.autoSearch !== 'function') {
        return;
      }

      this.lastSearch = Date.now();
      this.timerId = setTimeout(() => {
        this.data.autoSearch(e.detail.value).then(json => {
          this.setData({
            result: json
          });
        }).catch(err => {
          console.error('search error', err);
        });
      }, this.data.throttle);
    },

    selectResult(e) {
      const {
        index
      } = e.currentTarget.dataset;
      const item = this.data.result[index];
      this.triggerEvent('selectresult', {
        index,
        item
      });
    },

    search() {
      if (typeof this.data.search !== 'function') {
        return;
      }

      this.data.search(this.data.value).then(json => {
        this.setData({
          result: json
        });
      }).catch(err => {
        console.error('search error', err);
      });
    },

    slideButtonTap(e) {
      const index = e.currentTarget.dataset.index;
      const item = this.data.result[index];
      this.triggerEvent('slidebuttontap', {
        index,
        item,
        data: e.detail.data
      });
    },

    buttonTap(e) {
      this.triggerEvent('buttontap', e.detail);
    },

    _triggerSearch(newVal) {
      if (newVal) {
        this.search();
      }
    }
  }
});