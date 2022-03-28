module.exports = function  request(options) {
    return new Promise((resolve,reject)=>{
      wx.showLoading({
        title: 'loading...',
      })
      wx.request({
        ...options,
        success(res){
          resolve(res.data)
        },
        fail(err){
          reject(err)
        },
        complete(){
          wx.hideLoading()
        }
      })
    })
}