const store = {
    state: {
      hotSearchOffsetY: 0,
      flapCardVisible: false,
      isEditMode: false,
      shelfList: [],
      shelfSelected: [], //书架中被选中的图书列表
      shelfTitleVisible: true
    },
    mutations: {
      SET_HOT_SEARCH_OFFSETY(state, y) {
        state.hotSearchOffsetY = y
      },
      SET_FLAP_CARD_VISIBLE(state, visible) {
        state.flapCardVisible = visible
      },
      SET_IS_EDIT_MODE(state, isEditMode) {
        state.isEditMode = isEditMode
      },
      SET_SHELF_LIST(state, list) {
        state.shelfList = list
      },
      SET_SHELF_SELECTED(state, selected) {
        state.shelfSelected = selected
      },
      SET_SHELF_TITLE_VISIBLE(state, visible) {
        state.shelfTitleVisible = visible
      }
    }
  }
  
  export default store
