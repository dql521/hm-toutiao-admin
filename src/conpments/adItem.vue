<template>
<div class="ss">
    <div class="alls">
     <div>
         <img :src="img" alt="" width="36px" height="36px" >
     </div>
     <div class="rightItem">
         <h2 >总广告数</h2>
         <div class="adnum">153</div>
         <div class="bottom">
         <p >上周 6</p> 
         <p style=" margin-left: 40px;">同比 15%</p></div>
     </div>
    <div class="vertrLine">

    </div>
    </div>
</div>
</template>
<script>
import allAd from '../assets/allAd.png'
import onShelves from '../assets/onShelves.png'
import shelves from '../assets/shelves.png'
import didShelves from '../assets/didShelves.png'
export default {
     name:'ad-item',
     props:['img'],
    data () {
        return {
            dateIcon: [
                { icons: allAd},
                { icons: onShelves},
                {icons: shelves},
                {icons: didShelves}
            ],
        }
    }
}
</script>
<style lang="scss" scoped>
.ss{
     display:inline-block;
      width: 24.9%;
      border-right:1px solid #E5E5E5;
      align-items: center;
}
.alls{
    background-color: white;
    display: flex;
    flex-direction: row;
    align-items:center;
    margin-left: 5%;
    .bottom{
     display: flex;
     flex-direction: row;
     align-items:center;
  
}
}
.rightItem{
  margin-left: 32px;
}
.adnum{
    font-size: 40px;
    color: #222222;
    font-weight: Bold;
  
    }
// .vertrLine{
//     // margin-left: 24.9%;
//     width: 1px;
//     height: 130px;
//     background-color: #e0e0e0;
// }

h2{
  font-size: 16px;
  color: #222222;
  font-weight: Regular;
  
}
p{
    color: #8F99AB;
    font-size: 16px;
    font-weight: Regular;
}
</style>