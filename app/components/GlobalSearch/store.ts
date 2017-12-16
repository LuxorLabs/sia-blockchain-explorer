import { observable } from 'mobx'

class Search {
  @observable public open = false
}

export default new Search()
