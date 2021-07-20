class BCFirebaseModel {
  constructor() {}
  init() {
    return Promise.resolve();
  }
  loadPath(path) {
    return firebase
      .database()
      .ref(path)
      .once('value')
      .then(resultRaw => {
        let pResult = resultRaw.val();

        return Promise.resolve(pResult);
      });
  }
  loadPathBy(path, orderBy) {
    return firebase
      .database()
      .ref(path)
      .orderBy(orderBy)
      .once('value')
      .then(resultRaw => {
        let pResult = resultRaw.val();

        return Promise.resolve(pResult);
      });
  }
  loadPathByChild(path, orderByChild) {
    return firebase
      .database()
      .ref(path)
      .orderByChild(orderByChild)
      .once('value')
      .then(resultRaw => {
        let pResult = resultRaw.val();

        return Promise.resolve(pResult);
      });
  }
}
