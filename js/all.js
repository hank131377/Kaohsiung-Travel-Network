const data = [];
const place = document.querySelector('.place');
const areaname = document.querySelector('.areaname');
const subject = document.querySelector('.subject');
const pagediv = document.querySelector('.pagediv');
const datadiv = document.querySelector('.datadiv');
const gotop = document.querySelector('.gotop');
const godown = document.querySelector('.godown');
const body = document.body;

let nowdata = [];
let currentpage = 1;

axios.get('https://api.kcg.gov.tw/api/service/Get/9c8e1450-e833-499c-8320-29b36b7ace5c')
   .then(function(responseText){
        const getdata = responseText.data.data.XML_Head.Infos.Info;
        let arraydata = [];

        getdata.forEach(function(k){
         let local = [];
         local.Name = k.Name;
         local.Opentime = k.Opentime;
         local.Add = k.Add;
         local.Dist = k.Add.substr(6,3);
         if(local.Dist === '那瑪夏'){
            local.Dist = '那瑪夏區'
         };
         local.Tel = k.Tel;
         local.Ticketinfo = k.Ticketinfo;
         if(local.Ticketinfo === '' || local.Ticketinfo === '免費' || local.Ticketinfo === '免費入園'){
            local.Ticketinfo = '免費參觀'
         };
         if(local.Ticketinfo !=="免費參觀"){
            local.title = k.Ticketinfo
            local.Ticketinfo = '請移置票券圖片查詢'
         }
         local.Picture = k.Picture1;
         local.Alt = k.Picdescribe1;
         data.push(local);
         nowdata = data
         arraydata.push(local.Dist)
        });
        arraydata = [...new Set(arraydata)];
        
        arraydata.forEach(function(k){
         const opt = document.createElement('OPTION');
         opt.textContent = k;
         place.appendChild(opt);
        })
        pagination(data)
        areaname.textContent = '歡迎來高雄'
     });

place.addEventListener('change',changelist,false);
function changelist(e){
   nowdata = [];
   currentpage = 1;
   data.forEach(function(k){
      if(e.target.value === k.Dist){
         nowdata.push(k);
         areaname.textContent = e.target.value;
      }
      else if(e.target.value === 'welcome'){
         nowdata = data;
         areaname.textContent = '歡迎來高雄'
      }

   });
   pagination(nowdata);
};


subject.addEventListener('click',hotdist,false);
function hotdist(e){
   e.preventDefault();
   if(e.target.nodeName !== 'INPUT'){return}
   {  
      changelist(e);
      place.value = e.target.value
   }
};

function pagination(data){
   const len = data.length;
   const datanuber = 8;
   const pagenuber = 5;
   const total = Math.ceil(len/datanuber);
   let minpage;
   let maxpage;
   if(currentpage > total){
      currentpage = total;
   } 
   if(total >= pagenuber){
      if(currentpage <=3 ){
          minpage = 1;
          maxpage = pagenuber
      } 
      else if (currentpage > 3){
          if((currentpage+2) < total){
              minpage = currentpage - 2;
              maxpage = currentpage + 2
          }
          else{
              minpage = total - 4;
              maxpage = total ;
          };
      }
   }
   else if(total < pagenuber){
      minpage = 1;
      maxpage = total;
  };
   const page = {
      minpage,
      maxpage,
      prevpage:  currentpage > 1,
      nextpage: currentpage < total
   }
   printpage(page);

   const display = {
      datanuber,
      total
   }
   datarow(display);

};

function printpage(page){
   let str = '';
   if(page.prevpage){
       str+=`<li><a class="prev" href='#'>< prev</a></li>`
   }
   else{
       str+=`<li>< prev</li>`
   };

   for(let i = page.minpage;i <= page.maxpage;i++){
      if(currentpage === i){
         str+=`<li><a class="current" href='#'>${i}</a></li>`
      }
      else{
         str+=`<li><a href='#'>${i}</a></li>`
      }
   };

   if(page.nextpage){
       str+=`<li><a class="next" href='#'>next ></a></li>`
   }
   else{
       str+=`<li>next ></li>`
   };

   pagediv.innerHTML = str;
};

pagediv.addEventListener('click',changepage,false);
function changepage(e){
    e.preventDefault();
    if(e.target.nodeName !== 'A'){return}
    {
      if(e.target.textContent === '< prev'){
        currentpage--
      }
    else if(e.target.textContent === 'next >'){
        currentpage++
    }
    else{
        currentpage = Number(e.target.textContent)
    }}
    pagination(nowdata);
};

body.addEventListener('keydown',function(e){
   console.log(currentpage)
   if(e.keyCode === 37 && currentpage > 1){
      document.querySelector(".prev").click();
   }
   if(e.keyCode === 39){
      document.querySelector(".next").click();
   }
},false)

function datarow(k){
   const min = (currentpage * k.datanuber) - k.datanuber;
   const max = currentpage * k.datanuber;
   let str = '';
   for(let i = min ; i < max ;i++){
       if(!nowdata[i]){break}
       str+=`
       <div class='dd'>
         <div class="ddd" style="background-image: url(${nowdata[i].Picture}";>
           <h3>${nowdata[i].Name}</h3>
           <p>${nowdata[i].Dist}</p>
         </div>
         <div class="ddd2">
           <p class="all"><img src="img/icons_clock.png">${nowdata[i].Opentime}</p>
           <p> <a class="all" href="https://www.google.com.tw/maps/search/${nowdata[i].Add}" target=_blank><img src="img/icons_pin.png">${nowdata[i].Add}</a></p>
           <p class="push"><img src="img/icons_phone.png">${nowdata[i].Tel}</p>
           <p class="right"><img src="img/icons_tag.png" title='${nowdata[i].title}'>${nowdata[i].Ticketinfo}</p>
         </div>
       </div>
       `
   }
   datadiv.innerHTML = str
};

gotop.addEventListener('click',function(e){
   e.preventDefault();
   scroll(0,0);
},false)

window.onscroll = function scrolltop(){ 
  if (document.documentElement.scrollTop > 200){
   document.querySelector(".gotop").style.display = "block";
  }else{
   document.querySelector(".gotop").style.display = "none";
  }
}

godown.addEventListener('click',function(e){
   e.preventDefault();
   scroll(0,5000)
},false);

