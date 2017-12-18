import { observable } from 'mobx'

class MainStore {
  @observable currentBlock = null
}

const ms = new MainStore()

export default ms
