const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const debounce = (timers, fn, wait, e) => {
  let timer = setTimeout(() => {
    if (e) {
      fn(e)
    } else {
      fn();
    }
  }, wait)
  timers.push(timer);

  for (let i = 1; i < timers.length; i++) {
    clearTimeout(timers[i]);
  }

}

const random = ((count, arr, min, max) => {
  let temp=[...arr];
  let randomArr = [];
  let result = [];
  let c = 0;
  while (1) {
    max = temp.length - 1;
    let index = Math.floor(Math.random() * max + min)
    randomArr.push(temp[index]);
    temp.splice(index, 1);
    c++;
    if (c == count) {
      return randomArr;
    }
  }
})

const calcDay=str=>{
  let time = str.match(/\w{4}-\w{2}-\w{2}/g)
  let differ = new Date().getTime() - new Date(time).getTime()
  //天数
  let day = Math.floor(differ / (24 * 60 * 60 * 1000));

  //小时
  let level1 = differ % (24 * 3600 * 1000)
  let hour = Math.floor(level1 / (3600 * 1000))

  //分钟
  let level2 = level1 % (3600 * 1000);
  let minutes = Math.floor(level2 / (60 * 1000))

  //秒
  let level3 = level2 % (60 * 1000);
  let seconds = Math.round(level3 / 1000);
  if (day > 0) {
    return day + '天'
  } else if (hour > 0) {
    return hour + '小时'
  } else if (minutes > 0) {
    return minutes + '分钟'
  } else {
    return seconds + '秒钟'
  }
}

const switchPage=((url,obj)=>{
  let len=Object.getOwnPropertyNames(obj).length;
  let query='';
  let count=0;
  for(let key in obj){
    if(count==0){
      query+='?'+key+'='+obj[key];
      count=1;
    }else{
      query+='&'+key+'='+obj[key];
    }
  }
  wx.navigateTo({
    url: `${url}`,
  })
})
module.exports = {
  formatTime,
  debounce,
  random,
  switchPage,
  calcDay
}
